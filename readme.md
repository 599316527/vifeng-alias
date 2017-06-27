Vifeng Alias
================================



### 命令行调用

更新指定节目

```sh
node cli/index.js update {programId} [--pageNo 1 [--pageCount 20]]
```

生成播客rss

```sh
node cli/index.js podcast {programId} [--pageNo 1 [--pageCount 20 [--mediaType video|audio]]]
```


### API 调用

```js
import {ProgramFetcher, ProgramModel} from 'vifeng-alias'
ProgramFetcher.fetchProgram(programId, pageNo, pageCount).then(function (data) {
    // data.weMedia  -> 节目信息
    // data.bodyList -> 剧集列表
    
    let model = new ProgramModel(programId, {db})
    return Promise.all([
        model.saveProgramInfo(data.weMedia),
        model.saveProgramItems(data.bodyList)
    ])
})
```

### Web服务
