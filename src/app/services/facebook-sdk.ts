import { Inject, Injectable } from '@angular/core';

@Injectable()
export class FacebookSdkLoader {

    loadFacebookSdk(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            (<any>window).fbAsyncInit = function() {
                FB.init({
                    appId      : '495152287625522',
                    cookie     : true,
                    xfbml      : true,
                    version    : 'v3.1'
                });
                FB.AppEvents.logPageView();
                resolve(true);
                console.log("Finished initializing facebook sdk.");
            };

            (function(d, s, id){
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {return;}
                js = d.createElement(s); js.id = id;
                js.src = "https://connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));  
        });
    }
}