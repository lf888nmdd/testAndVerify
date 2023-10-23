import {syncFromQueryToMempool} from '../src'

async function syncMempool(){
    await syncFromQueryToMempool()
}

syncMempool()