import axios, { AxiosInstance, AxiosResponse } from 'axios';

interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

class RequestError extends Error {
  constructor(public message: string, public status?: number, public response?: AxiosResponse) {
    super((response && response.config ? response.config.url : '') + message);
  }

  isApiException = true;
}

interface UTXO {
  address: string;
  codeType: number;
  height: number;
  idx: number;
  inscriptions: [
    {
      inscriptionId: string;
      inscriptionNumber: number;
      isBRC20: boolean;
      moved: boolean;
      offset: number;
    }
  ];
  isOpInRBF: boolean;
  satoshi: number;
  scriptPk: string;
  scriptType: string;
  txid: string;
  vout: number;
}

interface TickerDetail {
  completeBlocktime: number;
  completeHeight: number;
  confirmedMinted: string;
  confirmedMinted1h: string;
  confirmedMinted24h: string;
  creator: string;
  decimal: number;
  deployBlocktime: number;
  deployHeight: number;
  historyCount: number;
  holdersCount: number;
  inscriptionId: string;
  inscriptionNumber: number;
  inscriptionNumberEnd: number;
  inscriptionNumberStart: number;
  limit: string;
  max: string;
  mintTimes: number;
  minted: string;
  ticker: string;
  totalMinted: string;
  txid: string;
}

export class QueryAPi {
  private axios: AxiosInstance;

  constructor(params: { baseUrl: string }) {
    this.axios = axios.create({
      baseURL: params.baseUrl, // 设置 baseURL
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json' // 添加默认的 Content-Type 头
      }
    });

    this.axios.interceptors.response.use(
      (async (
        response: AxiosResponse<{
          code: number;
          msg: string;
          data: any;
        }>
      ) => {
        const res = response.data;
        if (res.code != 0) {
          throw new RequestError(res.msg);
        }
        return res.data;
      }) as any,
      (error) => {
        
        if (error.response) {
          return Promise.reject(new RequestError(error.response.data, error.response.status, error.response));
        }

        if (error.isAxiosError) {
          return Promise.reject(new RequestError('noInternetConnection'));
        }
        return Promise.reject(error);
      }
    );
  }

  async getBlockChainInfo() {
    const response = await this.axios.get<
      null,
      {
        chain: string;
        blocks: number;
        headers: number;
        bestBlockHash: string;
        prevBlockHash: string;
        difficulty: string;
        medianTime: number;
        chainwork: string;
      }
    >('/blockchain/info');
    return response;
  }

  async localPushtx(txhex: string) {
    const response = await this.axios.post<null, string>('/local_pushtx', { txhex });
    return response;
  }

  async getAddressBalance(address: string) {
    const response = await this.axios.get<
      null,
      {
        address: string;
        btcPendingSatoshi: number;
        btcSatoshi: number;
        btcUtxoCount: number;
        inscriptionPendingSatoshi: number;
        inscriptionSatoshi: number;
        inscriptionUtxoCount: number;
        pendingSatoshi: number;
        satoshi: number;
        utxoCount: number;
      }
    >(`/address/${address}/balance`);
    return response;
  }

  async getAddressInscriptionUtxo(address: string, cursor = 0, size = 16) {
    const response = await this.axios.get<null, UTXO[]>(
      `/address/${address}/inscription-utxo?cursor=${cursor}&size=${size}`
    );
    return response;
  }

  async getAddressInscriptionUtxoData(address: string, cursor = 0, size = 16) {
    const response = await this.axios.get<
      null,
      {
        cursor: number;
        total: number;
        totalConfirmed: number;
        totalUnconfirmed: number;
        totalUnconfirmedSpend: number;
        utxo: UTXO[];
      }
    >(`/address/${address}/inscription-utxo-data?cursor=${cursor}&size=${size}`);
    return response;
  }

  async getAddressUtxo(address: string, cursor = 0, size = 16) {
    const response = await this.axios.get<null, UTXO[]>(`/address/${address}/utxo?cursor=${cursor}&size=${size}`);
    return response;
  }

  async getAddressUtxoData(address: string, cursor = 0, size = 16) {
    const response = await this.axios.get<
      null,
      {
        cursor: number;
        total: number;
        totalConfirmed: number;
        totalUnconfirmed: number;
        totalUnconfirmedSpend: number;
        utxo: UTXO[];
      }
    >(`/address/${address}/utxo-data?cursor=${cursor}&size=${size}`);
    return response;
  }

  async getBlockTxs(height: number, cursor?: number, size?: number) {
    const response = await this.axios.get<
      null,
      {
        blkid: string;
        confirmations: number;
        height: number;
        idx: number;
        inSatoshi: number;
        locktime: number;
        nIn: number;
        nInInscription: number;
        nLostInscription: number;
        nNewInscription: number;
        nOut: number;
        nOutInscription: number;
        outSatoshi: number;
        size: number;
        timestamp: number;
        txid: string;
        witOffset: number;
      }[]
    >(`/height/${height}/block/txs`);
    return response;
  }

  async getRawtx(txid: string) {
    const response = await this.axios.get<null, string>(`/rawtx/${txid}`);
    return response;
  }

  async getTx(txid: string) {
    const response = await this.axios.get<
      null,
      {
        blkid: string;
        confirmations: number;
        height: number;
        idx: number;
        inSatoshi: number;
        locktime: number;
        nIn: number;
        nInInscription: number;
        nLostInscription: number;
        nNewInscription: number;
        nOut: number;
        nOutInscription: number;
        outSatoshi: number;
        size: number;
        timestamp: number;
        txid: string;
        witOffset: number;
      }
    >(`/tx/${txid}`);
    return response;
  }

  async getTxIns(txid: string, cursor = 0, size = 16) {
    const response = await this.axios.get<
      null,
      {
        height: number;
        txid: string;
        idx: number;
        scriptSig: string;
        scriptWits: string;
        sequence: number;
        heightTxo: number;
        utxid: string;
        vout: number;
        address: string;
        codeType: number;
        satoshi: number;
        scriptType: string;
        scriptPk: string;
        inscriptions: [];
      }[]
    >(`/tx/${txid}/ins?cursor=${cursor}&size=${size}`);
    return response;
  }

  async getTxOuts(txid: string, cursor = 0, size = 16) {
    const response = await this.axios.get<
      null,
      {
        address: string;
        codeType: number;
        height: number;
        heightSpent: number;
        idx: number;
        inscriptions: [
          {
            inscriptionId: string;
            inscriptionNumber: number;
            isBRC20: boolean;
            moved: boolean;
            offset: number;
          }
        ];
        satoshi: number;
        scriptPk: string;
        scriptType: string;
        txid: string;
        txidSpent: string;
        vout: number;
      }[]
    >(`/tx/${txid}/outs?cursor=${cursor}&size=${size}`);
    return response;
  }

  async getAddressBrc20Summary(address: string, start = 0, limit = 16) {
    const response = await this.axios.get<
      null,
      {
        detail: {
          availableBalance: 'string';
          overallBalance: 'string';
          ticker: 'string';
          transferableBalance: 'string';
        }[];
        height: 0;
        start: 0;
        total: 0;
      }
    >(`/address/${address}/brc20/summary?cursor=${start}&size=${limit}`);
    return response;
  }

  async getAddressBrc20History(address: string, ticker: string, start = 0, limit = 16) {
    const response = await this.axios.get<
      null,
      {
        detail: {
          ticker: string;
          type: string;
          txid: string;
        }[];
        height: 0;
        start: 0;
        total: 0;
      }
    >(`/address/${address}/brc20/${ticker}/history?start=${start}&limit=${limit}`);
    return response;
  }

  async getAddressHistory(address: string, cursor = 0, size = 16) {
    const response = await this.axios.get<
      null,
      {
        detail: {
          txid: string;
          height: number;
        }[];
        start: 0;
        total: 0;
      }
    >(`/address/${address}/history?cursor=${cursor}&size=${size}`);
    return response;
  }

  async getBrc20BestHeight() {
    const response = await this.axios.get<
      null,
      {
        height: 0;
        total: 0;
      }
    >(`/brc20/bestheight`);
    return response;
  }

  async getBrc20TickerHolders(ticker: string, start = 0, limit = 16) {
    const response = await this.axios.get<
      null,
      {
        detail: {
          address: string;
          availableBalance: string;
          overallBalance: string;
          transferableBalance: string;
        }[];
        height: number;
        start: number;
        total: number;
      }
    >(`/brc20/${ticker}/holders?start=${start}&limit=${limit}`);
    return response;
  }

  async getBrc20TickerInfo(ticker: string) {
    const response = await this.axios.get<null, TickerDetail>(`/brc20/${ticker}/info`);
    return response;
  }

  async getBrc20Status(start = 0, limit = 16) {
    const response = await this.axios.get<
      null,
      {
        height: number;
        total: number;
        start: number;
        detail: TickerDetail[];
      }
    >(`/brc20/status?status=${start}&limit=${limit}`);
    return response;
  }

  async getInscribeSummary(ticker: string) {
    const response = await this.axios.get<null, TickerDetail>(`/brc20/${ticker}/info`);
    return response;
  }
}
