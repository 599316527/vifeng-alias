
const programsCollectionName = 'programs'
const itemsCollectionName = 'programItems'

class ProgramModel {

    constructor({db}) {
        this.db = db
    }

    readPrograms({pageNo = 1, pageSize = 20, filter = {}} = {}) {
        return this.db.collection(programsCollectionName)
            .find(filter)
            .skip(pageSize * (pageNo - 1))
            .limit(pageSize)
            .toArray()
    }

    readProgramInfo(programId) {
        return this.db.collection(programsCollectionName).findOne({
            programId
        })
    }

    saveProgramInfo(programId, info) {
        info.programId = programId

        return this.db.collection(programsCollectionName).updateOne({
            programId: this.programId
        }, {
            $set: info
        }, {
            upsert: true
        })
    }

    readProgramItems(programId, {
        pageNo = 1,
        pageSize = 20,
        filter = {},
        sort = {'memberItem.programNo': -1}
    }) {
        return this.db.collection(itemsCollectionName).find(Object.assign({
            programId
        }, filter))
            .sort(sort)
            .skip(pageSize * (pageNo - 1))
            .limit(pageSize)
            .toArray()
    }

    saveProgramItems(programId, items) {
        let col = this.db.collection(itemsCollectionName)

        return Promise.all(items.map((item) => {
            item.programId = programId

            return col.findOneAndReplace({
                programId,
                itemId: item.itemId
            }, item, {
                upsert: true
            })
        }))
    }

    readProgramItem(programId, itemId) {
        return this.db.collection(itemsCollectionName).findOne({
            programId,
            itemId
        })
    }

}


module.exports = ProgramModel
