
let promisify = require('./helper').promisify

const programsCollectionName = 'programs'
const itemsCollectionName = 'programItems'

class ProgramModel {

    constructor(programId, {db}) {
        this.programId = programId
        this.db = db
    }

    readProgramInfo() {
        return this.db.collection(programsCollectionName).findOne({
            programId: this.programId
        })
    }

    saveProgramInfo(info) {
        info.programId = this.programId

        return this.db.collection(programsCollectionName).updateOne({
            programId: this.programId
        }, {
            $set: info
        }, {
            upsert: true
        })
    }

    readProgramItems({pageNo = 1, pageCount = 20, filter = {}}) {
        return this.db.collection(itemsCollectionName).find(Object.assign({
            programId: this.programId
        }, filter))
            .sort({'memberItem.programNo': -1})
            .skip(pageCount * (pageNo - 1))
            .limit(pageCount)
            .toArray()
    }

    saveProgramItems(items) {
        let col = this.db.collection(itemsCollectionName)

        return Promise.all(items.map((item) => {
            item.programId = this.programId

            return col.findOneAndReplace({
                programId: this.programId,
                itemId: item.itemId
            }, item, {
                upsert: true
            })
        }))
    }

    readProgramItem(itemId) {
        return this.db.collection(itemsCollectionName).findOne({
            programId: this.programId,
            itemId
        })
    }

}


module.exports = ProgramModel
