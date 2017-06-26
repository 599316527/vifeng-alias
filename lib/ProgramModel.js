
let promisify = require('./helper').promisify

const collectionName = 'program'

class ProgramModel {

    constructor(programId, {db}) {
        this.programId = programId
        this.db = db

        this.collection = db.collection(collectionName)
    }

    readProgramInfo() {
        return this.collection.findOne({
            programId: this.programId
        }, {
            fields: {
                info: 1
            }
        }).then(function (result) {
            return result.info
        })
    }

    saveProgramInfo(info) {
        return this.collection.updateOne({
            programId: this.programId
        }, {
            $set: {
                programId: this.programId,
                info,
                items: []
            }
        }, {
            upsert: true
        })
    }

    readProgramItems(pageNo = 1, pageCount = 20) {
        return this.collection.aggregate([
            {
                $match: {
                    programId: this.programId
                }
            },
            {
                $sort: {
                    'items.memberItem.programNo': -1
                }
            },
            {
                $project: {
                    items: {
                        $slice: ['$items', (pageNo - 1) * pageCount, pageCount]
                    }
                }
            }
        ]).toArray().then(function (docs) {
            return docs.reduce(function (items, item) {
                return items.concat(item.items)
            }, [])
        })
    }

    saveProgramItems(items) {
        let operations = items.map((item) => {
            return {
                replaceOne: {
                    filter: {
                        programId: this.programId,
                        items: {
                            $elemMatch: {
                                itemId: item.itemId
                            }
                        }
                    },
                    replacement: {
                        $addToSet: {
                            items: item
                        }
                    },
                    upsert: true
                }
            }
        })

        return this.collection.bulkWrite(operations, {
            ordered: true,
            w: 1
        })
    }

    readProgramItem(itemId) {
        return this.collection.findOne({
            programId: this.programId,
            items: {
                $elemMatch: {
                    itemId
                }
            }
        })
    }

}


module.exports = ProgramModel
