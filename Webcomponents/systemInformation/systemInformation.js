class SystemInformation{
    constructor(){
        this.info = navigator.userAgent;
        this.os;
        this.arch;
        
        this.info.match(/Android/i) ? this.os = "Android" :
        this.info.match(/webOS/i) ? this.os = "WebOS" :
        this.info.match(/iPhone/i) ? this.os = "iPhone" :
        this.info.match(/iPad/i) ? this.os = "iPad" :
        this.info.match(/iPod/i) ? this.os = "iPod" :
        this.info.match(/BlackBerry/i) ? this.os = "BlackBerry" :
        this.info.match(/Windows Phone/i) ? this.os = "Windows Phone" :
        this.info.match(/Windows NT 10.0/i) ? this.os = "Windows" :
        this.info.match(/Raspbian/i) ? this.os = "Raspbian" :
        this.info.match(/Linux/i) ? this.os = "Linux" :
        this.os = this.info

        
        this.info.match(/x64/i)? this.arch = "x64" :
        this.info.match(/x86/i)? this.arch = "x86" :
        this.info.match(/armv7l/i)? this.arch = "ARM V7l" :
        this.arch = this.info
    }
}
