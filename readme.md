Vifeng Alias
================================



### 命令行调用

更新指定节目

```sh
node cli/index.js update {programId} [--pageNo 1 [--pageSize 20]]
```

生成播客rss

```sh
node cli/index.js podcast {programId} [--pageNo 1 [--pageSize 20 [--mediaType video|audio]]]
```


### API 调用

```js
import {ProgramFetcher, ProgramModel} from 'vifeng-alias'
ProgramFetcher.fetchProgram(programId, pageNo, pageSize).then(function (data) {
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

```sh
pushd app/web/client
npm install
npm run build
popd
npm run webapp
```
