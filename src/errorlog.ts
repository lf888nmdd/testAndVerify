class ErrorLog{
    async addTime(){
        var today = new Date(); //获取当前时间
 
        var yy:number = today.getFullYear();       //  年
        var mm:number = today.getMonth() + 1;      //  月，0~11，是从0开始，如果不加1就只有11
        var dd:number = today.getDate();           //  日
        var xq:number = today.getDay();            //  星期
        var hh:number = today.getHours();          //  小时
        var mM:number = today.getMinutes();        //  分钟
        var ss:any = today.getSeconds();        //  秒
        if(ss<10){
            ss='0'+ss
        }

        const time=yy+'-'+mm+'-'+dd+'++'+hh+'-'+mM+'-'+ss

        return time
    }
    async addTest(response:any,numIf:number){
        console.log('sj-------',await this.addTime())
        const fs=require('fs')
        // writeFile()可以接收四个参数，第一个是路径，第二个是文件内容，
        //第三个可选项代表权限，第四个是回调函数。这里第三个参数通常省略
        let data:any
        let url:string=''
        if(numIf==1){
            data=response
            url='testAndVerify'
        }else{
            data={
                "method":response.config.method,
                "url":response.config.url,
                "data":response.config.data,
                "status":response.status,
                "error":response.data
            }
            url='errorLog'
            
        }
        //将javascript对象转换为json字符串
        let yy =JSON.stringify(data);
        const addtime=await this.addTime()
        fs.writeFile(`./${url}/${addtime}.json`,yy,err=>{
            if(err){
                console.log('Write error',err);
            }else{
                console.log(`Error file writing,route:./errorLog/${addtime}.json`);
            }
        })
    }
}

export default ErrorLog