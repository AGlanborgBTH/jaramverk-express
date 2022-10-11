const ObjectId = require('mongodb').ObjectId; 
const database = require('../../database')

const get = {
    all: async (id) => {
        const db = await database.getDb();
        const result = await db.collection.find(id).toArray();
        await db.client.close();
        return result;
    },
    one: async (id) => {
        const db = await database.getDb();
        const result = await db.collection.findOne({"_id": ObjectId(`${id}`)});
        await db.client.close();
        return result;
    }
}

module.exports = get
