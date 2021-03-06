namespace aw {

     /**
      * @language zh_CN
     * @class aw.FindXDataDriver
     * @classdesc
     * 棋盘格纹理
     */
    export class FindXDataDriver extends aw.GameDataDriver {
        protected _pickedXCnt: number =  0; // 当前已经拾取的目标物体数

        protected _totalObjCnt:number =  4;// 物体总数
        protected _XObjCnt:    number =  1;// 需要找到的目标物体数
        protected _maxFaceCnt: number =  4;// 物体的最大面数
        protected _XFaceCnt:   number =  4;// 物体上有特殊字符的面数

        protected _moveSpeed:  number = 5; // 移动线速度
        protected _rotateSpeed:number = 1; // 移动转速

        private _charsFind: string = "X";   // 特殊字符
        private _charsPool: string[] = ["入", "人" ];  // 干扰字符

        private _readyTips: string = "";
        private _startTips: string = "";
        private _pauseTips: string = "";
        private _winTips: string = "";
        private _failedTips: string = "";

        private _stageCtr: any[] = [
            {"ttCnt":  4, "xoCnt": 1, "tmLMT":  5, "mvSPD":  5, "rtSPD": 1, "mfCnt": 4, "xfCnt": 4, "cP": ["X",  "入", "人"] },
            {"ttCnt":  8, "xoCnt": 3, "tmLMT": 12, "mvSPD":  5, "rtSPD": 2, "mfCnt": 4, "xfCnt": 4, "cP": ["白", "自", "日", "目"] },
            {"ttCnt": 10, "xoCnt": 2, "tmLMT": 20, "mvSPD":  3, "rtSPD": 3, "mfCnt": 4, "xfCnt": 4, "cP": ["天", "夭"] },
            {"ttCnt": 12, "xoCnt": 3, "tmLMT": 15, "mvSPD":  3, "rtSPD": 4, "mfCnt": 4, "xfCnt": 4, "cP": ["发", "大", "犬", "友"] },
            {"ttCnt": 14, "xoCnt": 4, "tmLMT": 30, "mvSPD":  6, "rtSPD": 5, "mfCnt": 4, "xfCnt": 4, "cP": ["日", "曰", "目"] },
            {"ttCnt": 16, "xoCnt": 2, "tmLMT": 40, "mvSPD":  6, "rtSPD": 3, "mfCnt": 4, "xfCnt": 4, "cP": ["籍", "藉"] },
            {"ttCnt": 18, "xoCnt": 4, "tmLMT": 20, "mvSPD":  4, "rtSPD": 6, "mfCnt": 4, "xfCnt": 4, "cP": ["拔", "拨"]},
            {"ttCnt": 20, "xoCnt": 4, "tmLMT": 12, "mvSPD":  6, "rtSPD": 6, "mfCnt": 4, "xfCnt": 4, "cP": ["阡", "迁", "歼", "奸"] },
            {"ttCnt": 24, "xoCnt": 4, "tmLMT": 32, "mvSPD":  5, "rtSPD": 6, "mfCnt": 4, "xfCnt": 4, "cP": ["慕", "幕", "墓", "暮", "蓦", "募"] },
            {"ttCnt": 26, "xoCnt": 4, "tmLMT": 12, "mvSPD":  5, "rtSPD": 6, "mfCnt": 4, "xfCnt": 4, "cP": ["稍", "梢", "捎" ] },
            {"ttCnt": 24, "xoCnt": 4, "tmLMT": 25, "mvSPD":  8, "rtSPD": 6, "mfCnt": 4, "xfCnt": 4, "cP": ["魏", "巍", "翼", "冀"] },
            {"ttCnt": 20, "xoCnt": 3, "tmLMT": 22, "mvSPD":  5, "rtSPD": 2, "mfCnt": 4, "xfCnt": 4, "cP": ["恭", "慕", "龚", "巷"] },
            {"ttCnt": 22, "xoCnt": 3, "tmLMT": 20, "mvSPD":  3, "rtSPD": 3, "mfCnt": 4, "xfCnt": 4, "cP": ["喜", "嘻", "善", "熹"] },
            {"ttCnt": 24, "xoCnt": 4, "tmLMT": 20, "mvSPD":  4, "rtSPD": 3, "mfCnt": 4, "xfCnt": 4, "cP": ["年", "午", "牛"] },
            {"ttCnt": 24, "xoCnt": 4, "tmLMT": 30, "mvSPD":  4, "rtSPD": 4, "mfCnt": 4, "xfCnt": 4, "cP": ["吉", "古", "舌", "杏", "志"] },
            {"ttCnt": 24, "xoCnt": 4, "tmLMT": 40, "mvSPD":  6, "rtSPD": 4, "mfCnt": 4, "xfCnt": 4, "cP": ["猴", "候", "喉"] },
            {"ttCnt": 24, "xoCnt": 4, "tmLMT": 30, "mvSPD":  6, "rtSPD": 5, "mfCnt": 4, "xfCnt": 4, "cP": ["财", "材", "贩", "赐", "则"] },
            {"ttCnt": 20, "xoCnt": 4, "tmLMT": 20, "mvSPD":  6, "rtSPD": 5, "mfCnt": 4, "xfCnt": 4, "cP": ["天", "太", "夭"] },
        ];

        private urlLoader: egret.URLLoader = null;
        private urlReq: egret.URLRequest = null;
        private url: string = '/saveStage/';
        private _needSave: boolean = null;

        constructor( startTime: Date = null ) {
            super( startTime );
            this._pickedXCnt = 0;
            this._readyTips= `目标:${this._XObjCnt}个${this._charsFind}\n点触继续...`;
            this._startTips = `目标:${this._XObjCnt}个${this._charsFind}\n点触开始... `;
            this._pauseTips = `暂停中，触摸/点击任意处继续... `;

            this._winTips = ` :) 过关\n点触继续${this.stage}关... `;
            let rest_cnt = this._XObjCnt - this._pickedXCnt;
            this._failedTips = ` :(， 差${rest_cnt}个过关!\n点触再来... `;

            this.urlLoader = new egret.URLLoader();
			this.urlLoader.dataFormat = egret.URLLoaderDataFormat.TEXT;
            this.urlReq = new egret.URLRequest(this.url);
            this._needSave = true;
        }
        public StartGame( startTime: Date = null ){
			console.log("Single total stage count:" + this._stageCtr.length);
			super.StartGame( startTime );
            this._pickedXCnt = 0;
            this._readyTips = `目标:${this._XObjCnt}个${this._charsFind}\n点触继续... `;
            this._startTips = `目标:${this._XObjCnt}个${this._charsFind}\n点触开始... `;
            this._pauseTips = `暂停中，点触继续... `;

            this._winTips = ` :) 过关\n点触继续${this.stage}关... `;
            let rest_cnt = this._XObjCnt - this._pickedXCnt;
            this._failedTips = ` :(， 差${rest_cnt}个过关!\n点触再来... `;

            this.UpdateStageCtrData();
            this._needSave = true;
        }

        public set totalObjCnt(v: number) {
            this._totalObjCnt = v;
        }
        public get totalObjCnt(): number {
            return this._totalObjCnt;
        }

        public set moveSpeed(v: number) {
            this._moveSpeed = v;
        }
        public get moveSpeed(): number {
            return this._moveSpeed;
        }
 
        public set rotateSpeed(v: number) {
            this._rotateSpeed = v;
        }
        public get rotateSpeed(): number {
            return this._rotateSpeed;
        }

        public get readyTips(): string {
            return this._readyTips;
        }
        public get startTips(): string {
            return this._startTips;
        }
        public get pauseTips(): string {
            return this._pauseTips;
        }
        public get winTips(): string {
            return this._winTips;
        }
        public get failedTips(): string {
            return this._failedTips;
        }

        public set xObjCnt(v: number) {
            this._XObjCnt = v;
        }
        public get xObjCnt(): number {
            return this._XObjCnt;
        }

        public set maxFaceCnt(v: number) {
            this._maxFaceCnt = v;
        }
        public get maxFaceCnt(): number {
            return this._maxFaceCnt;
        }

        public set xFaceCnt(v: number) {
            this._XFaceCnt = v;
        }
        public get xFaceCnt(): number {
            return this._XFaceCnt;
        }

        public set charsFind(c: string){
            this._charsFind = c;
        }
        public get charsFind(): string {
            return this._charsFind;
        }

        public set charsPool(v: string[]) {
            this._charsPool = v;
        }
        public get charsPool(): string[] {
            return this._charsPool;
        }

        public addPickedXCnt(v: number=1) {
            this._pickedXCnt += v;
        }
        public get pickedXCnt(): number {
            return this._pickedXCnt;
        }

        public set needSave(b: boolean) {
            this._needSave = b;
        }
        public get needSave(): boolean {
            return this._needSave;
        }

        public Update( ){
            if ( this._startTime == null ) {
         	    this._driverState = GameDataState.READY_GO;
                return;
            }
            super.Update( );
			if ( this._pickedXCnt == this._XObjCnt && this._driverState == GameDataState.IN_RUN) {
                this._driverState = GameDataState.USER_WIN;
        	    this.StageUp();
                this._winTips  = ` :) 过关\n点触继续${this.stage}关... `;
                this._readyTips= `目标:${this._XObjCnt}个${this._charsFind}\n点触继续...`;

                if ( this._needSave ) {
                    this.onPlayerStageSave(true);
                }

                return;
            }
            if ( this._driverState == GameDataState.TIME_OVER ){
                let rest_cnt = this._XObjCnt - this._pickedXCnt;
                this._failedTips = ` :(， 差${rest_cnt}个过关!\n点触再来... `;

                if ( this._needSave ) {
                    this.onPlayerStageSave(false);
                }

                return;
            }
        }

        // 保存关卡玩的结果数据
        private onPlayerStageSave(win: boolean){
            if (this.urlLoader && this.urlReq){
                this._needSave = ! this._needSave;
                this.urlLoader.addEventListener(egret.Event.COMPLETE, this.onSaveStageOk, this);
                let rest_cnt = this._XObjCnt - this._pickedXCnt;
                let data = "";
				if ( win ) {
                	data = "win=" + win + "&stage=" + (this.stage-1) + "&useTime=" + (this.lostSeconds10/10-0.1) + "&restCnt=0";
                    if  ( Main.nt_user && 'id' in Main.nt_user ){
                        data += "&id=" + Main.nt_user.id;
                    }
                    esa.EgretSA.loadingSet(5+(this.stage-1), "用户通过第" + (this.stage-1) + "关")
				}
				else {
                	data = "win=" + win + "&stage=" + this.stage + "&useTime=" + (this.lostSeconds10/10-0.1) + "&restCnt=" + rest_cnt;
                    if  ( Main.nt_user && 'id' in Main.nt_user ){
                        data += "&id=" + Main.nt_user.id;
                    }
				}
                this.urlReq.data = new egret.URLVariables( data );
            	this.urlReq.method = egret.URLRequestMethod.POST;
                console.log("send data [" + this.urlReq.data.toString() + "] to server:" + this.url);
                this.urlLoader.load( this.urlReq );
            }
            else{
                console.log("this.urlLoader is null or this.urlReq is null");
            }
        }

        private onSaveStageOk(e: egret.Event ){
            this.urlLoader.removeEventListener(egret.Event.COMPLETE, this.onSaveStageOk, this);
            if (this.urlLoader){
                var data:egret.URLVariables = this.urlLoader.data;
                console.log("save to server return:");
                console.log( data.toString() );
            }
            else{
                console.log("this.urlLoader is null");
            }
        }


        protected StageUp(): number {
            super.StageUp();
            this.UpdateStageCtrData();
            return this.stage;
        }

        private UpdateStageCtrData() {
            let multi = Math.ceil( this.stage / this._stageCtr.length );
            if (multi == 0 ) multi = 1;
            let idx = (this.stage-1) % this._stageCtr.length;

            this._totalObjCnt = multi * this._stageCtr[idx]["ttCnt"]
            this._XObjCnt     = multi * this._stageCtr[idx]["xoCnt"]
            this._maxFaceCnt  = multi * this._stageCtr[idx]["mfCnt"]
            this._XFaceCnt    = multi * this._stageCtr[idx]["xfCnt"]
            this._moveSpeed   = multi * this._stageCtr[idx]["mvSPD"]
            this._rotateSpeed = multi * this._stageCtr[idx]["rtSPD"]

            this.maxSeconds   = multi * this._stageCtr[idx]["tmLMT"]

            let cIdx = multi - 1;
            if ( cIdx >= this._stageCtr[idx]["cP"].length ) cIdx = this._stageCtr[idx]["cP"].length - 1;
            this._charsFind   = this._stageCtr[idx]["cP"][cIdx]
            this._charsPool   = [];
            for(let c of this._stageCtr[idx]["cP"]) {
                if ( c != this._charsFind ){ this._charsPool.push( c ); }
            }
        }
    }
}
