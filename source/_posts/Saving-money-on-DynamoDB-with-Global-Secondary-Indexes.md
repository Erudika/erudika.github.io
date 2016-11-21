layout: post
title: Saving money on DynamoDB with Global Secondary Indexes
date: 2016-11-21 17:39:07
tags: [aws, dynamodb, tips]
author: alex@erudika.com
comments: true
img: img9.jpg
---

**Amazon's DynamoDB** is a fully managed database service running inside the AWS cloud which is super-scalable and fast. It is perfect for write-intensive workflows and low-latency queries. Its main advantages are the adjustable read and write performance and global secondary indexes (GSI).

We migrated from Cassandra to DynamoDB a while back. This decision was taken mainly because of the tunable performance and also because it's a managed service and we had one less thing to maintain. Later we found out that global indexes could help us save a lot of extra costs and so we implemented a simple solution, which we call "shared tables".

<!-- more -->

![](https://erudika.com/assets/img/blogpost_media7.png)

Our solution is applicable to cases where you have a large number of Dynamo tables but each of these has a low utilization. For example, it may contain a few hundred items and have low throughput capacity of 1 read and 1 write per second. The idea is to combine those tables into one and save some money. First, let's look at this neat ASCII diagram of what we have so far.

<pre>

 +-----+ +-----+ +-----+     +-----+
 | id1 | | id3 | | id5 |     | idX |
 +-----+ +-----+ +-----+ ... +-----+
 | id2 | | id4 | | id6 |     | idY |
 +-----+ +-----+ +-----+     +-----+
 Table 1 Table 2 Table 3     Table N

</pre>

We are going to create a new table called `shared` and also we'll have to create the global secondary index to that table which is treated like a separate table. We can do this through the console or by calling the AWS SDK.

```java
boolean createSharedTable(String sharedTableName, long readCapacity, long writeCapacity) {
  if (existsTable(sharedTableName)) {
    return false;
  }
  try {
    // build the GSI request
    GlobalSecondaryIndex secIndex = new GlobalSecondaryIndex().
        withIndexName(sharedTableName + "-index").
        withProvisionedThroughput(new ProvisionedThroughput().
            withReadCapacityUnits(1L).
            withWriteCapacityUnits(1L)).
        withProjection(new Projection().withProjectionType(ProjectionType.ALL)).
        withKeySchema(new KeySchemaElement().withAttributeName("tableID").withKeyType(KeyType.HASH),
            new KeySchemaElement().withAttributeName("timestamp").withKeyType(KeyType.RANGE));

    // create the shared table with the above GSI attached
    getClient().createTable(new CreateTableRequest().withTableName(sharedTableName).
        withKeySchema(new KeySchemaElement(Config._KEY, KeyType.HASH)).
        withAttributeDefinitions(new AttributeDefinition(Config._KEY, ScalarAttributeType.S),
            new AttributeDefinition("tableID", ScalarAttributeType.S),
            new AttributeDefinition("timestamp", ScalarAttributeType.S)).
        withGlobalSecondaryIndexes(secIndex).
        withProvisionedThroughput(new ProvisionedThroughput(readCapacity, writeCapacity)));
  } catch (Exception e) {
    logger.error("Failed to create shared table.", e);
    return false;
  }
  return true;
}
```

First we make a GSI request object by specifying its throughput — 1 read/1 write is sufficient as a starting point. This setting is determined by the number of queries (per second) to the database. Then we specify the attributes which will be copied over to the secondary index (all in this case). This allows us to retrieve the data from the index directly instead of getting just the `id` from the index then reading the actual object from the `shared` table as a second request. Finally, and most importantly, we need to set the attributes on which the index is defined — these will be `tableID` and `timestamp`. Going back to the first diagram, each table name will correspond to a `tableID` in the `shared` table. This will be the attribute which splits up the big table into smaller subtables (i.e. views). The `timestamp` field is used for sorting and is the so called "range" component of our index.

The result of the above request is going to be the table `shared` and the index `shared-index`.

<pre>

  WRITE TO +          READ FROM ^
           |                    |
  +--------v---+      +---------+--+
  | table1_id1 |      | table1_id1 |
  +------------+      +------------+
  | table2_id3 |      | table1_id2 |
  +------------+      +------------+
  | table3_id5 |      | table2_id3 |
  +------------+      +------------+
  | table1_id2 |      | table2_id4 |
  +------------+      +------------+
  | table2_id4 +------+ table3_id5 |
  +------------+      +------------+
  | table3_id6 |      | table3_id6 |
  +------------+      +------------+
  |   . . .    |      |   . . .    |
  +------------+      +------------+
  | tableN_idX |      | tableN_idX |
  +------------+      +------------+
  | tableN_idY |      | tableN_idY |
  +------------+      +------------+
      shared           shared-index

</pre>

The next important decision will be the format of the primary key in the `shared` table. We've decided to go for `tableID_objectID` — each object key is prefixed by the name of the table it belongs to. It's a simple and effective way to avoid key collisions and make sure that a request coming from "table1" cannot read the objects in "table2", for example.

Now, we have to modify our code to be able to make requests to the new shared table and to do that we wrote a simple "routing" function which gives us the correct key to an object in a shared table:

```java
String getKeyForTableID(String key, String tableID) {
  // if table is shared return the composite key
  if (isSharedTable(tableID)) {
    return tableID + "_" + key;
  } else {
    return key;
  }
}
```

So, if we had a read function in our code called `readObject(key, table)` this will have to be changed to `readObject(getKeyForTableID(key, table))`. Thus we can not only read from standard tables but also we can read object from our `shared` table. Finally, if we want to query multiple objects (pages of objects) from `shared` we do a scan operation on the global index instead of the original table.

```java
String readPageFromSharedTable(String tableID, String fromKey, List<Page<Item, QueryOutcome>> results) {
  ValueMap valueMap = new ValueMap().withString(":tid", tableID);
  valueMap.put(":ts", fromKey);
  Index index = getSharedIndex(tableID);

  QuerySpec spec = new QuerySpec().withMaxPageSize(100).withMaxResultSize(100).
      withKeyConditionExpression("tableID = :tid and timestamp > :ts").
      withValueMap(valueMap);

  Page<Item, QueryOutcome> items = index.query(spec);

  if (items.hasNextPage()) {
    results.add(items.firstPage());
    // return last key as a start key to next page
    return items.getLowLevelResult().getQueryResult().getLastEvaluatedKey().get("timestamp").getS();
  } else {
    return null;
  }
}
```

## Conclusion

Alright, we have combined several tables into one, but how is that going to affect our AWS bill at the end of the month? Let's do some simple calculations. At the time of writing, a table with 1/1 throughput costs **$0.66/month**. This is the minimum cost of a table per month. If we had 100 small tables in the beginning, we'd have to pay **(100 * 0.66) = $66 per month**. That's a lot, especially if our tables were underutilized. The shared table with a global secondary index would cost a mere **$1.32/month** for the minimum capacity of 1 read/s and 1 write/s. That's a *50x* cost reduction — good job!

*If you liked this post, you should check out [Para](https://paraio.com) - our backend service for busy developers. Also, chat with us [on Gitter](https://gitter.im/Erudika/para)!*