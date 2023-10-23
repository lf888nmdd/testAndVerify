import { syncFromQueryToMempool,syncFromQueryToBlockstream,checkBlockStatus,queryContrast } from "../src";

async function syncJob(){

    // 检查三个服务的区块高度是否一致
    // 如果一致，则打印当前区块高度
    // 如果不一致，则打印每个服务各自的高度，并抛出异常警告
    // await checkBlockStatus()


    // await syncFromQueryToMempool()  //a同步b
    // await syncFromQueryToBlockstream() //a同步c

    //检验两个QuerAPi的这五个API数据是否一致
    await queryContrast()

}


syncJob()