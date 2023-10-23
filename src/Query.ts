import axios from "axios";

interface getClass {
  code: number;
  msg: string;
  data: any
}

interface TickerDetail {
  "ticker": string,
  "holdersCount": number
  "historyCount": number
  "inscriptionNumber": number
  "inscriptionId": string
  "max": string
  "limit": string
  "minted": string
  "totalMinted": string
  "confirmedMinted": string
  "confirmedMinted1h": string
  "confirmedMinted24h": string
  "mintTimes": number
  "decimal": number
  "creator": string
  "txid": string
  "deployHeight": number,
  "deployBlocktime": number,
  "completeHeight": number
  "completeBlocktime": number
  "inscriptionNumberStart": number
  "inscriptionNumberEnd": number
}

function compareTickerDetail(detailA:TickerDetail,detailB:TickerDetail){
  const ticker = detailA.ticker;
  for(var id in detailA){
    if(detailA[id]!==detailB[id]){
      console.log( `detail of ${ticker} is not the same`,detailA,detailB)
      return false;
    }
  }
  return true;
}

class QueryApi {
  //https://query-api.unisat.io
  baseUrl: string = ''
  constructor(url: string) {
    this.baseUrl = url
  }

  async getMempool() {
    const list = await axios.get<getClass>(`${this.baseUrl}/api-brc20/getrawmempool`);
    const { code, msg, data } = list.data
    return data
  }

  async getRawTx(txid: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/api-brc20/rawtx/${txid}`)
    // console.log('原始数据---------', _res.data)
    return _res.data.data
  }

  async blocks() {
    const _res1 = await axios.get<getClass>(`${this.baseUrl}/api-brc20/blockchain/info`)
    const { code, msg, data } = _res1.data;
    if (code !== 0) {
      throw new Error(msg)
    }
    return data.blocks;
  }

  // async bestheight() {
  //   const _res = await axios.get<getClass>(`${this.baseUrl}/brc20/bestheight`);
  //   return _res.data.data
  // }

  // async status() {
  //   const _res = await axios.get<getClass>(`${this.baseUrl}/brc20/status`)
  //   return _res.data.data
  // }

  // async history(ticker: string) {
  //   const _res = await axios.get<getClass>(`${this.baseUrl}/brc20/${ticker}/history`)
  //   return _res.data.data
  // }

  // async holders(ticker: string) {
  //   const _res = await axios.get<getClass>(`${this.baseUrl}/brc20/${ticker}/holders`)
  //   return _res.data.data
  // }

  async getrawmempool() {
    const _res = await axios.get<getClass>(`${this.baseUrl}/getrawmempool`)
    return _res.data.data

  }

  async postLocalPushtx(txHex: string) {
    const _res = await axios.post<getClass>(`${this.baseUrl}/local_pushtx`, txHex)
    return _res.data.data
  }

  // async info(ticker: any) {
  //   const _res = await axios.get<getClass>(`${this.baseUrl}/brc20/${ticker}/info`)
  //   return _res.data.data
  // }

  async mempoolInfo() {
    const _res = await axios.get<getClass>(`${this.baseUrl}/mempool/info`)
    return _res.data.data
  }

  // async summary(address: string) {
  //   const _res = await axios.get<getClass>(`${this.baseUrl}/address/${address}/brc20/summary`)
  //   return _res.data.data
  // }

  //UTXO

  async balance(address: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/address/${address}/balance`)
    return _res.data.data
  }

  async nscriptionUtxo(address: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/address/${address}/inscription-utxo`)
    return _res.data.data
  }

  async inscriptionUtxoData(address: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/address/${address}/inscription-utxo-data`)
    return _res.data.data
  }

  async utxoData(address: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/address/${address}/utxo-data`)
    return _res.data.data
  }

  async uxtoTxidIndex(address: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/utxo/{txid}/{index}`)
    return _res.data.data
  }

  async utxo(address: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/address/${address}/utxo`)
    return _res.data.data
  }


  //BRC20
  async summary(address: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/address/${address}/brc20/summary`)
    return _res.data.data
  }

  async RPC20history(address: string, ticker: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/address/${address}/brc20/${ticker}/history`)
    return _res.data.data
  }

  async historyInscriptions(address: string, ticker: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/address/${address}/brc20/${ticker}/history-inscriptions`)
    return _res.data.data
  }

  async BRC20info(address: string, ticker: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/address/${address}/brc20/${ticker}/info`)
    return _res.data.data
  }

  async transferableInscriptions(address: string, ticker: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/address/${address}/brc20/${ticker}/transferable-inscriptions`)
    return _res.data.data
  }

  async bestheight() {
    const _res = await axios.get<getClass>(`${this.baseUrl}/brc20/bestheight`)
    return _res.data.data
  }

  async status():Promise<{height:number;total:number;start:number;detail:TickerDetail[]}> {
    const _res = await axios.get<getClass>(`${this.baseUrl}/brc20/status`)
    return _res.data.data
  }

  async history(ticker: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/brc20/${ticker}/history`)
    return _res.data.data
  }

  async holders(ticker: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/brc20/${ticker}/holders`)
    return _res.data.data
  }

  async info(ticker: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/brc20/${ticker}/info`)
    return _res.data.data
  }

  async historyTxid(ticker: string, txid: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/brc20/${ticker}/tx/${txid}/history`)
    return _res.data.data
  }

  async transfer() {
    const _res = await axios.post<getClass>(`${this.baseUrl}/inscribe/order/brc20/transfer`)
    return _res.data.data
  }

  //Inscription

  async namesData(address: string, category: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/address/${address}/category/${category}/names-data`)
    return _res.data.data
  }

  async inscribeFeeSummary(address: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/address/${address}/inscribe-fee-summary`)
    return _res.data.data
  }

  async inscribeSummary(address: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/address/${address}/inscribe-summary`)
    return _res.data.data
  }

  async inscription(address: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/address/${address}/inscription`)
    return _res.data.data
  }

  async inscriptionData(address: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/address/${address}/inscription-data`)
    return _res.data.data
  }

  async inscriptionId(address: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/address/${address}/inscription-id`)
    return _res.data.data
  }

  async namesSummary(address: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/address/${address}/names-summary`)
    return _res.data.data
  }

  async InscriptionSummary() {
    const _res = await axios.get<getClass>(`${this.baseUrl}/admin/inscribe/order/summary`)
    return _res.data.data
  }

  async timeSeries() {
    const _res = await axios.get<getClass>(`${this.baseUrl}/admin/inscribe/order/time-series`)
    return _res.data.data
  }

  async orderId(orderId: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/inscribe/order/${orderId}`)
    return _res.data.data
  }

  async receiveAddress(receiveAddress: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/inscribe/orders/${receiveAddress}`)
    return _res.data.data
  }

  async contentInscriptionId(inscriptionId: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/inscription/content/${inscriptionId}`)
    return _res.data.data
  }

  async infoInscriptionId(inscriptionId: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/inscription/info/${inscriptionId}`)
    return _res.data.data
  }

  async CATEGORYSearchV2() {
    const _res = await axios.get<getClass>(`${this.baseUrl}/inscriptions/category/CATEGORY/search/v2`)
    return _res.data.data
  }

  async allSearchV2() {
    const _res = await axios.get<getClass>(`${this.baseUrl}/inscriptions/category/all/search/v2`)
    return _res.data.data
  }

  async bitmapSearchV2() {
    const _res = await axios.get<getClass>(`${this.baseUrl}/inscriptions/category/bitmap/search/v2`)
    return _res.data.data
  }

  async brc20SearchV2() {
    const _res = await axios.get<getClass>(`${this.baseUrl}/inscriptions/category/brc20/search/v2`)
    return _res.data.data
  }

  async newsNewsV2() {
    const _res = await axios.get<getClass>(`${this.baseUrl}/inscriptions/category/news/news/v2`)
    return _res.data.data
  }

  async numberSearchV2() {
    const _res = await axios.get<getClass>(`${this.baseUrl}/inscriptions/category/number/search/v2`)
    return _res.data.data
  }

  async satsSearchV2() {
    const _res = await axios.get<getClass>(`${this.baseUrl}/inscriptions/category/sats/search/v2`)
    return _res.data.data
  }

  async textSearchV2() {
    const _res = await axios.get<getClass>(`${this.baseUrl}/inscriptions/category/text/search/v2`)
    return _res.data.data
  }

  async unisatSearchV2() {
    const _res = await axios.get<getClass>(`${this.baseUrl}/inscriptions/category/unisat/search/v2`)
    return _res.data.data
  }

  async wordSearchV2() {
    const _res = await axios.get<getClass>(`${this.baseUrl}/inscriptions/category/word/search/v2`)
    return _res.data.data
  }

  async inscriptionsSummary() {
    const _res = await axios.get<getClass>(`${this.baseUrl}/inscriptions-summary`)
    return _res.data.data
  }

  async categorySearchV2(category: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/inscriptions/category/${category}/search/v2`)
    return _res.data.data
  }

  async inscriptionsTag(tag: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/inscriptions/${tag}`)
    return _res.data.data
  }

  async categoryName(category: string, name: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/names-info/category/${category}/${name}`)
    return _res.data.data
  }

  async infoSatsname(satsname: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/sats/info/${satsname}`)
    return _res.data.data
  }

  async unisatname(unisatname: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/unisat/info/${unisatname}`)
    return _res.data.data
  }

  async inscriptionsInfo() {
    const _res = await axios.post<getClass>(`${this.baseUrl}/inscriptions/info`)
    return _res.data.data
  }

  async existence(category: string) {
    const _res = await axios.post<getClass>(`${this.baseUrl}/inscriptions/category/${category}/existence`)
    return _res.data.data
  }

  async InscriptionOrder() {
    const _res = await axios.post<getClass>(`${this.baseUrl}/inscribe/order`)
    return _res.data.data
  }

  //History

  async historyHistory(address: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/address/${address}/history`)
    return _res.data.data
  }

  async historyInfo(address: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/address/${address}/history/info`)
    return _res.data.data
  }

  async historyTx(address: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/address/${address}/history/tx`)
    return _res.data.data
  }

  //Block

  async idBlkid(blkid: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/block/id/${blkid}`)
    return _res.data.data
  }

  async blockBlocks() {
    const _res = await axios.get<getClass>(`${this.baseUrl}/blocks`)
    return _res.data.data
  }

  async feeEstimate() {
    const _res = await axios.get<getClass>(`${this.baseUrl}/fee-estimate`)
    return _res.data.data
  }

  async heightBlock(height: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/height/${height}/block`)
    return _res.data.data
  }

  // Tx

  async txBlkid(blkid: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/block/txs/${blkid}`)
    return _res.data.data
  }

  async txTxs(height: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/height/${height}/block/txs`)
    return _res.data.data
  }

  async txTxid(txid: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/height/{height}/rawtx/${txid}`)
    return _res.data.data
  }

  async txHeightTxid(height: string, txid: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/height/${height}/tx/${txid}`)
    return _res.data.data
  }

  async txRawtxTxid(txid: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/rawtx/${txid}`)
    return _res.data.data
  }

  async txTxTxid(txid: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/tx/${txid}`)
    return _res.data.data
  }

  //Txin

  async txinIndex(height: string, txid: string, index: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/height/${height}/tx/${txid}/in/${index}`)
    return _res.data.data
  }

  async txinIns(height: string, txid: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/height/${height}/tx/${txid}/ins`)
    return _res.data.data
  }

  async txinInIndex(txid: string, index: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/tx/${txid}/in/${index}`)
    return _res.data.data
  }

  async txTxidIns(txid: string) {
    const _res = await axios.get<getClass>(`${this.baseUrl}/tx/${txid}/ins`)
    return _res.data.data
  }



  async contrast() {
    let list: any = [[], [], []]
    const bestheight = this.bestheight()

    const status = await this.status();


    const historyList = [[], [], []]
    for (let i = 0; i < 3; i++) {
      if (status.detail.length >= 1) {
        const history = await this.history(status.detail[i].ticker)
        historyList[0].push(history)
        const holders = await this.holders(status.detail[i].ticker)
        historyList[1].push(holders)
        const info = await this.info(status.detail[i].ticker)
        historyList[2].push(info)
      }

    }

    list[0].push(bestheight)
    list[1].push(status)
    list[2].push(historyList)

    console.log('结束---------', this.baseUrl, list)

    return list

  }

}

export default QueryApi