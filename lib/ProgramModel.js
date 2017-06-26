
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
                programId: 1,
                info: 1
            }
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

    }

    saveProgramItems(items) {
        // let deleteFilter = {
        //     programId: this.programId,
        //     items: {
        //         $elemMatch: {
        //             itemId: {
        //                 $in: items.map(function (item) {
        //                     return item.itemId
        //                 })
        //             }
        //         }
        //     }
        // }

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

    }

    saveProgramItem(itemId, programItem) {

    }

}


module.exports = ProgramModel
