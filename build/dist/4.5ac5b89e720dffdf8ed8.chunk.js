webpackJsonp([4],{"5Exl":function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var a=e("LMZF"),l=(e("6Xbx"),e("UHIZ")),i=e("keN9"),r=e("4gSy"),o=e("TpDf"),d=e("21Dn"),s=e("AP4T"),u=(e("HECM"),e("oei5"),e("RyBE")),p=e("+Z5Y"),m=(e("cOqr"),function(){function t(t,n,e,a,l){this.activeRoute=t,this.route=n,this.dataManagement=e,this.titleService=a,this.dataEmitter=l,this.result=[],this.progress="0",this.timeLeft=0,this.finished=!1,this.totalKeywords=0,this.givenKeywords=0,this.giveHint=!1,this.timeLimit=!1,this.timerLimit="30",this.instantResult=!1,this.randomOrder=!1}return t.prototype.ngOnInit=function(){var t=this;this.activeRoute.params.subscribe(function(n){var e=n.testId;t.giveHint="true"==t.activeRoute.snapshot.queryParamMap.get("giveHint"),parseInt(t.activeRoute.snapshot.queryParamMap.get("timeLimit"))>0&&(t.timeLimit=!0,t.timerLimit=t.activeRoute.snapshot.queryParamMap.get("timeLimit")+""),t.instantResult="true"==t.activeRoute.snapshot.queryParamMap.get("instantResult"),t.activeRoute.snapshot.queryParamMap.get("questionId")&&(t.selectedId=parseInt(t.activeRoute.snapshot.queryParamMap.get("questionId"))),t.dataManagement.getDATA(d.a+"/api/tests/"+e).subscribe(function(n){var a=[],l=new o.c(n.data[0]._id,n.data[0].title,a,n.data[0].author);t.dataManagement.getDATA(d.a+"/api/tests/"+e+"/questions").subscribe(function(n){for(var e=0;e<n.data.length;e++)a.push(new o.a(n.data[e]._id,n.data[e].question,n.data[e].answer,n.data[e].category,n.data[e].hint,n.data[e].keywords));t.test=l,t.startTest(),t.titleService.setTitle(t.test.title+" live test - DigitalStudy")})})})},t.prototype.startTest=function(){this.selectedId||(this.selectedId=0),this.selectedQuestion=this.test.questions[this.selectedId],this.timeLimit&&this.testTimer()},t.prototype.testTimer=function(){var t=this,n=s.Observable.timer(0,100),e=parseInt(this.timerLimit);this.subscription=n.subscribe(function(n){t.progress=(n/e*10).toFixed(2),n>10*e&&t.submitQuestion()})},t.prototype.submitQuestion=function(){if(this.answer){if(this.subscription&&this.subscription.unsubscribe(),this.selectedId<this.test.questions.length){this.selectedId++;var t=this.checkAnswer(),n=t/this.selectedQuestion.keywords.length*100;this.result.push(new o.b(this.selectedQuestion._id,this.selectedQuestion.question,this.selectedQuestion.answer,this.selectedQuestion.category,this.answer,this.timeLimit?this.timeLeft:0,n,t)),this.instantResult&&this.dataEmitter.pushUpdateArray("Percentage answer result: "+n+"%"),this.progress="0",this.answer="",this.selectedQuestion=this.test.questions[this.selectedId],this.selectedQuestion||this.testFinished(),this.timeLimit&&this.testTimer()}}else this.dataEmitter.pushUpdateArray("Please put an answer of sort sort even if you are unsure!")},t.prototype.checkAnswer=function(){var t=this.answer.match(/\b(\w+)\b/g),n=[];if(t){for(var e=0;e<t.length;e++)n.push(t[e].toLowerCase());n.sort()}var a=[];if(this.selectedQuestion.keywords){for(e=0;e<this.selectedQuestion.keywords.length;e++)a.push(this.selectedQuestion.keywords[e].toLowerCase());a.sort()}return this.intersect_safe(a,n)},t.prototype.intersect_safe=function(t,n){for(var e=0,a=0,l=[];e<t.length&&a<n.length;)t[e]<n[a]?e++:t[e]>n[a]?a++:(l.push(t[e]),e++,a++);return l.length},t.prototype.keyDownFunction=function(t){13==t.keyCode&&this.submitQuestion()},t.prototype.testFinished=function(){for(var t=this,n=0,e=0;e<this.test.questions.length;e++)n+=this.test.questions[e].keywords.length;var a=0;for(e=0;e<this.result.length;e++)a+=this.result[e].markCount;var l=(a/n*100).toFixed(1);this.totalKeywords=n,this.givenKeywords=a,this.percentResult=l;for(var i=[],r=0;r<this.result.length;r++)i.push({_id:this.result[r]._id,mark:this.result[r].markCount+"/"+this.test.questions[r].keywords.length});var o=[];o.push({result:this.result,test:this.test,percentResult:this.percentResult,mark:this.givenKeywords+"/"+this.totalKeywords}),localStorage.setItem("result",JSON.stringify(o)),this.route.navigate(["tests/result",this.test._id]);var s={testId:this.test._id,testTitle:this.test.title,questionsToResult:i,mark:this.givenKeywords+"/"+this.totalKeywords,percent:parseInt(this.percentResult),private:!1};this.dataManagement.postDATA(d.a+"/api/results",s).subscribe(function(n){t.dataEmitter.pushUpdateArray(n.message)})},t.prototype.ngOnDestroy=function(){this.subscription&&this.subscription.unsubscribe()},t}()),c=function(){},g=e("hzkV"),f=e("k1En"),h=e("911F"),b=e("tM+F"),v=e("OylW"),y=e("KU+/"),x=e("c0x3"),w=e("HNiT"),C=e("vEzF"),k=e("6yhf"),R=e("KSSw"),_=e("Un6q"),I=e("0nO6"),T=e("9iV4"),H=e("4tdp"),E=e("j5BN"),N=e("V8+5"),q=e("l6RC"),M=e("4jwp"),L=e("OFGE"),S=e("8Xfy"),F=e("w24y"),D=e("vgc3"),X=e("R1vt"),z=e("ka8K"),O=e("3Czw"),P=e("LT5m"),Q=e("ppgG"),j=e("jk5D"),U=e("zQfh"),A=e("dN2u"),K=e("KRwK"),Z=e("hjRC"),V=e("LEoy"),B=e("IEAb"),Y=e("22qU"),W=e("ZYB1"),J=e("Lpd/"),G=e("SlD5"),$=e("CZgk"),tt=e("ghl+"),nt=e("Ioj9"),et=e("c4k3"),at=e("697t"),lt=e("e0rv"),it=e("YXpL"),rt=e("ki1d"),ot=e("dYU3"),dt=e("FhOc"),st=e("RXNa"),ut=e("cC+T"),pt=e("0cZJ"),mt=e("4+t2"),ct=e("+S/n"),gt=e("xSzo"),ft=e("BMWL"),ht=e("1adR"),bt=e("0dqe"),vt=e("m1oH"),yt=e("9Y3Q"),xt=e("qkrk"),wt=e("HToe"),Ct=e("Zz+K"),kt=e("wnyu"),Rt=e("tzcA"),_t=e("2waW"),It=e("PY9B"),Tt=e("IBeK"),Ht=e("g5gQ"),Et=e("xBEz"),Nt=e("PuIS"),qt=e("U0Tu"),Mt=e("3rU7"),Lt=e("Cb36"),St=e("5h8W"),Ft=e("6ade"),Dt=e("4HaF"),Xt=e("DaIH"),zt=e("0WLp"),Ot=e("3p+R"),Pt=a["\u0275crt"]({encapsulation:2,styles:[".mat-expansion-panel{transition:box-shadow 280ms cubic-bezier(.4,0,.2,1);box-sizing:content-box;display:block;margin:0;transition:margin 225ms cubic-bezier(.4,0,.2,1)}.mat-expansion-panel:not([class*=mat-elevation-z]){box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)}.mat-expanded .mat-expansion-panel-content{overflow:visible}.mat-expansion-panel-content,.mat-expansion-panel-content.ng-animating{overflow:hidden}.mat-expansion-panel-body{padding:0 24px 16px}.mat-expansion-panel-spacing{margin:16px 0}.mat-accordion .mat-expansion-panel-spacing:first-child{margin-top:0}.mat-accordion .mat-expansion-panel-spacing:last-child{margin-bottom:0}.mat-action-row{border-top-style:solid;border-top-width:1px;display:flex;flex-direction:row;justify-content:flex-end;padding:16px 8px 16px 24px}.mat-action-row button.mat-button{margin-left:8px}[dir=rtl] .mat-action-row button.mat-button{margin-left:0;margin-right:8px}"],data:{animation:[{type:7,name:"bodyExpansion",definitions:[{type:0,name:"collapsed",styles:{type:6,styles:{height:"0px",visibility:"hidden"},offset:null},options:void 0},{type:0,name:"expanded",styles:{type:6,styles:{height:"*",visibility:"visible"},offset:null},options:void 0},{type:1,expr:"expanded <=> collapsed",animation:{type:4,styles:null,timings:"225ms cubic-bezier(0.4,0.0,0.2,1)"},options:null}],options:{}}]}});function Qt(t){return a["\u0275vid"](0,[(t()(),a["\u0275and"](0,null,null,0))],null,null)}function jt(t){return a["\u0275vid"](2,[a["\u0275ncd"](null,0),(t()(),a["\u0275eld"](1,0,null,null,5,"div",[["class","mat-expansion-panel-content"]],[[2,"mat-expanded",null],[24,"@bodyExpansion",0],[8,"id",0]],null,null,null,null)),(t()(),a["\u0275eld"](2,0,null,null,3,"div",[["class","mat-expansion-panel-body"]],null,null,null,null,null)),a["\u0275ncd"](null,1),(t()(),a["\u0275and"](16777216,null,null,1,null,Qt)),a["\u0275did"](5,212992,null,0,$.c,[a.ComponentFactoryResolver,a.ViewContainerRef],{portal:[0,"portal"]},null),a["\u0275ncd"](null,2)],function(t,n){t(n,5,0,n.component._portal)},function(t,n){var e=n.component;t(n,1,0,e.expanded,e._getExpandedState(),e.id)})}var Ut=a["\u0275crt"]({encapsulation:2,styles:[".mat-expansion-panel-header{display:flex;flex-direction:row;align-items:center;padding:0 24px}.mat-expansion-panel-header:focus,.mat-expansion-panel-header:hover{outline:0}.mat-expansion-panel-header.mat-expanded:focus,.mat-expansion-panel-header.mat-expanded:hover{background:inherit}.mat-expansion-panel-header:not([aria-disabled=true]){cursor:pointer}.mat-content{display:flex;flex:1;flex-direction:row;overflow:hidden}.mat-expansion-panel-header-description,.mat-expansion-panel-header-title{display:flex;flex-grow:1;margin-right:16px}[dir=rtl] .mat-expansion-panel-header-description,[dir=rtl] .mat-expansion-panel-header-title{margin-right:0;margin-left:16px}.mat-expansion-panel-header-description{flex-grow:2}.mat-expansion-indicator::after{border-style:solid;border-width:0 2px 2px 0;content:'';display:inline-block;padding:3px;transform:rotate(45deg);vertical-align:middle}"],data:{animation:[{type:7,name:"indicatorRotate",definitions:[{type:0,name:"collapsed",styles:{type:6,styles:{transform:"rotate(0deg)"},offset:null},options:void 0},{type:0,name:"expanded",styles:{type:6,styles:{transform:"rotate(180deg)"},offset:null},options:void 0},{type:1,expr:"expanded <=> collapsed",animation:{type:4,styles:null,timings:"225ms cubic-bezier(0.4,0.0,0.2,1)"},options:null}],options:{}},{type:7,name:"expansionHeight",definitions:[{type:0,name:"collapsed",styles:{type:6,styles:{height:"{{collapsedHeight}}"},offset:null},options:{params:{collapsedHeight:"48px"}}},{type:0,name:"expanded",styles:{type:6,styles:{height:"{{expandedHeight}}"},offset:null},options:{params:{expandedHeight:"64px"}}},{type:1,expr:"expanded <=> collapsed",animation:{type:4,styles:null,timings:"225ms cubic-bezier(0.4,0.0,0.2,1)"},options:null}],options:{}}]}});function At(t){return a["\u0275vid"](0,[(t()(),a["\u0275eld"](0,0,null,null,0,"span",[["class","mat-expansion-indicator"]],[[24,"@indicatorRotate",0]],null,null,null,null))],null,function(t,n){t(n,0,0,n.component._getExpandedState())})}function Kt(t){return a["\u0275vid"](2,[(t()(),a["\u0275eld"](0,0,null,null,3,"span",[["class","mat-content"]],null,null,null,null,null)),a["\u0275ncd"](null,0),a["\u0275ncd"](null,1),a["\u0275ncd"](null,2),(t()(),a["\u0275and"](16777216,null,null,1,null,At)),a["\u0275did"](5,16384,null,0,_.NgIf,[a.ViewContainerRef,a.TemplateRef],{ngIf:[0,"ngIf"]},null)],function(t,n){t(n,5,0,n.component._showToggle())},null)}var Zt=a["\u0275crt"]({encapsulation:2,styles:[".mat-progress-bar{display:block;height:5px;overflow:hidden;position:relative;transform:translateZ(0);transition:opacity 250ms linear;width:100%}.mat-progress-bar .mat-progress-bar-element,.mat-progress-bar .mat-progress-bar-fill::after{height:100%;position:absolute;width:100%}.mat-progress-bar .mat-progress-bar-background{background-repeat:repeat-x;background-size:10px 4px;display:none}.mat-progress-bar .mat-progress-bar-buffer{transform-origin:top left;transition:transform 250ms ease}.mat-progress-bar .mat-progress-bar-secondary{display:none}.mat-progress-bar .mat-progress-bar-fill{animation:none;transform-origin:top left;transition:transform 250ms ease}.mat-progress-bar .mat-progress-bar-fill::after{animation:none;content:'';display:inline-block;left:0}.mat-progress-bar[dir=rtl],[dir=rtl] .mat-progress-bar{transform:rotateY(180deg)}.mat-progress-bar[mode=query]{transform:rotateZ(180deg)}.mat-progress-bar[mode=query][dir=rtl],[dir=rtl] .mat-progress-bar[mode=query]{transform:rotateZ(180deg) rotateY(180deg)}.mat-progress-bar[mode=indeterminate] .mat-progress-bar-fill,.mat-progress-bar[mode=query] .mat-progress-bar-fill{transition:none}.mat-progress-bar[mode=indeterminate] .mat-progress-bar-primary,.mat-progress-bar[mode=query] .mat-progress-bar-primary{animation:mat-progress-bar-primary-indeterminate-translate 2s infinite linear;left:-145.166611%}.mat-progress-bar[mode=indeterminate] .mat-progress-bar-primary.mat-progress-bar-fill::after,.mat-progress-bar[mode=query] .mat-progress-bar-primary.mat-progress-bar-fill::after{animation:mat-progress-bar-primary-indeterminate-scale 2s infinite linear}.mat-progress-bar[mode=indeterminate] .mat-progress-bar-secondary,.mat-progress-bar[mode=query] .mat-progress-bar-secondary{animation:mat-progress-bar-secondary-indeterminate-translate 2s infinite linear;left:-54.888891%;display:block}.mat-progress-bar[mode=indeterminate] .mat-progress-bar-secondary.mat-progress-bar-fill::after,.mat-progress-bar[mode=query] .mat-progress-bar-secondary.mat-progress-bar-fill::after{animation:mat-progress-bar-secondary-indeterminate-scale 2s infinite linear}.mat-progress-bar[mode=buffer] .mat-progress-bar-background{animation:mat-progress-bar-background-scroll 250ms infinite linear;display:block}@keyframes mat-progress-bar-primary-indeterminate-translate{0%{transform:translateX(0)}20%{animation-timing-function:cubic-bezier(.5,0,.70173,.49582);transform:translateX(0)}59.15%{animation-timing-function:cubic-bezier(.30244,.38135,.55,.95635);transform:translateX(83.67142%)}100%{transform:translateX(200.61106%)}}@keyframes mat-progress-bar-primary-indeterminate-scale{0%{transform:scaleX(.08)}36.65%{animation-timing-function:cubic-bezier(.33473,.12482,.78584,1);transform:scaleX(.08)}69.15%{animation-timing-function:cubic-bezier(.06,.11,.6,1);transform:scaleX(.66148)}100%{transform:scaleX(.08)}}@keyframes mat-progress-bar-secondary-indeterminate-translate{0%{animation-timing-function:cubic-bezier(.15,0,.51506,.40969);transform:translateX(0)}25%{animation-timing-function:cubic-bezier(.31033,.28406,.8,.73371);transform:translateX(37.65191%)}48.35%{animation-timing-function:cubic-bezier(.4,.62704,.6,.90203);transform:translateX(84.38617%)}100%{transform:translateX(160.27778%)}}@keyframes mat-progress-bar-secondary-indeterminate-scale{0%{animation-timing-function:cubic-bezier(.15,0,.51506,.40969);transform:scaleX(.08)}19.15%{animation-timing-function:cubic-bezier(.31033,.28406,.8,.73371);transform:scaleX(.4571)}44.15%{animation-timing-function:cubic-bezier(.4,.62704,.6,.90203);transform:scaleX(.72796)}100%{transform:scaleX(.08)}}@keyframes mat-progress-bar-background-scroll{to{transform:translateX(-10px)}}"],data:{}});function Vt(t){return a["\u0275vid"](2,[(t()(),a["\u0275eld"](0,0,null,null,0,"div",[["class","mat-progress-bar-background mat-progress-bar-element"]],null,null,null,null,null)),(t()(),a["\u0275eld"](1,0,null,null,1,"div",[["class","mat-progress-bar-buffer mat-progress-bar-element"]],null,null,null,null,null)),a["\u0275did"](2,278528,null,0,_.NgStyle,[a.KeyValueDiffers,a.ElementRef,a.Renderer2],{ngStyle:[0,"ngStyle"]},null),(t()(),a["\u0275eld"](3,0,null,null,1,"div",[["class","mat-progress-bar-primary mat-progress-bar-fill mat-progress-bar-element"]],null,null,null,null,null)),a["\u0275did"](4,278528,null,0,_.NgStyle,[a.KeyValueDiffers,a.ElementRef,a.Renderer2],{ngStyle:[0,"ngStyle"]},null),(t()(),a["\u0275eld"](5,0,null,null,0,"div",[["class","mat-progress-bar-secondary mat-progress-bar-fill mat-progress-bar-element"]],null,null,null,null,null))],function(t,n){var e=n.component;t(n,2,0,e._bufferTransform()),t(n,4,0,e._primaryTransform())},null)}var Bt=a["\u0275crt"]({encapsulation:2,styles:[".mat-card{transition:box-shadow 280ms cubic-bezier(.4,0,.2,1);display:block;position:relative;padding:24px;border-radius:2px}.mat-card:not([class*=mat-elevation-z]){box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)}.mat-card .mat-divider{position:absolute;left:0;width:100%}[dir=rtl] .mat-card .mat-divider{left:auto;right:0}.mat-card .mat-divider.mat-divider-inset{position:static;margin:0}@media screen and (-ms-high-contrast:active){.mat-card{outline:solid 1px}}.mat-card-flat{box-shadow:none}.mat-card-actions,.mat-card-content,.mat-card-subtitle,.mat-card-title{display:block;margin-bottom:16px}.mat-card-actions{margin-left:-16px;margin-right:-16px;padding:8px 0}.mat-card-actions-align-end{display:flex;justify-content:flex-end}.mat-card-image{width:calc(100% + 48px);margin:0 -24px 16px -24px}.mat-card-xl-image{width:240px;height:240px;margin:-8px}.mat-card-footer{display:block;margin:0 -24px -24px -24px}.mat-card-actions .mat-button,.mat-card-actions .mat-raised-button{margin:0 4px}.mat-card-header{display:flex;flex-direction:row}.mat-card-header-text{margin:0 8px}.mat-card-avatar{height:40px;width:40px;border-radius:50%;flex-shrink:0}.mat-card-lg-image,.mat-card-md-image,.mat-card-sm-image{margin:-8px 0}.mat-card-title-group{display:flex;justify-content:space-between;margin:0 -8px}.mat-card-sm-image{width:80px;height:80px}.mat-card-md-image{width:112px;height:112px}.mat-card-lg-image{width:152px;height:152px}@media (max-width:600px){.mat-card{padding:24px 16px}.mat-card-actions{margin-left:-8px;margin-right:-8px}.mat-card-image{width:calc(100% + 32px);margin:16px -16px}.mat-card-title-group{margin:0}.mat-card-xl-image{margin-left:0;margin-right:0}.mat-card-header{margin:-8px 0 0 0}.mat-card-footer{margin-left:-16px;margin-right:-16px}}.mat-card-content>:first-child,.mat-card>:first-child{margin-top:0}.mat-card-content>:last-child:not(.mat-card-footer),.mat-card>:last-child:not(.mat-card-footer){margin-bottom:0}.mat-card-image:first-child{margin-top:-24px}.mat-card>.mat-card-actions:last-child{margin-bottom:-16px;padding-bottom:0}.mat-card-actions .mat-button:first-child,.mat-card-actions .mat-raised-button:first-child{margin-left:0;margin-right:0}.mat-card-subtitle:not(:first-child),.mat-card-title:not(:first-child){margin-top:-4px}.mat-card-header .mat-card-subtitle:not(:first-child){margin-top:-8px}.mat-card>.mat-card-xl-image:first-child{margin-top:-8px}.mat-card>.mat-card-xl-image:last-child{margin-bottom:-8px}"],data:{}});function Yt(t){return a["\u0275vid"](2,[a["\u0275ncd"](null,0),a["\u0275ncd"](null,1)],null,null)}var Wt=e("ulOE"),Jt=a["\u0275crt"]({encapsulation:2,styles:[".mat-divider{display:block;margin:0;border-top-width:1px;border-top-style:solid}.mat-divider.mat-divider-vertical{border-top:0;border-right-width:1px;border-right-style:solid}.mat-divider.mat-divider-inset{margin-left:80px}[dir=rtl] .mat-divider.mat-divider-inset{margin-left:auto;margin-right:80px}"],data:{}});function Gt(t){return a["\u0275vid"](2,[],null,null)}var $t=e("ESfO");e.d(n,"LiveTestModuleNgFactory",function(){return tn}),e.d(n,"RenderType_LiveTestComponent",function(){return nn}),n.View_LiveTestComponent_0=sn,n.View_LiveTestComponent_Host_0=un,e.d(n,"LiveTestComponentNgFactory",function(){return pn});var tn=a["\u0275cmf"](c,[],function(t){return a["\u0275mod"]([a["\u0275mpd"](512,a.ComponentFactoryResolver,a["\u0275CodegenComponentFactoryResolver"],[[8,[g.a,f.a,f.b,h.a,b.a,v.a,y.a,x.a,w.a,C.a,k.a,R.a,pn]],[3,a.ComponentFactoryResolver],a.NgModuleRef]),a["\u0275mpd"](4608,_.NgLocalization,_.NgLocaleLocalization,[a.LOCALE_ID,[2,_["\u0275a"]]]),a["\u0275mpd"](4608,I.w,I.w,[]),a["\u0275mpd"](4608,T.HttpXsrfTokenExtractor,T["\u0275g"],[_.DOCUMENT,a.PLATFORM_ID,T["\u0275e"]]),a["\u0275mpd"](4608,T["\u0275h"],T["\u0275h"],[T.HttpXsrfTokenExtractor,T["\u0275f"]]),a["\u0275mpd"](5120,H.PendingInterceptorService,H.PendingInterceptorServiceFactory,[]),a["\u0275mpd"](5120,T.HTTP_INTERCEPTORS,function(t,n){return[t,n]},[T["\u0275h"],H.PendingInterceptorService]),a["\u0275mpd"](4608,T["\u0275d"],T["\u0275d"],[]),a["\u0275mpd"](6144,T.XhrFactory,null,[T["\u0275d"]]),a["\u0275mpd"](4608,T.HttpXhrBackend,T.HttpXhrBackend,[T.XhrFactory]),a["\u0275mpd"](6144,T.HttpBackend,null,[T.HttpXhrBackend]),a["\u0275mpd"](5120,T.HttpHandler,T["\u0275interceptingHandler"],[T.HttpBackend,[2,T.HTTP_INTERCEPTORS]]),a["\u0275mpd"](4608,T.HttpClient,T.HttpClient,[T.HttpHandler]),a["\u0275mpd"](4608,E.d,E.d,[]),a["\u0275mpd"](4608,N.a,N.a,[]),a["\u0275mpd"](6144,q.b,null,[_.DOCUMENT]),a["\u0275mpd"](4608,q.c,q.c,[[2,q.b]]),a["\u0275mpd"](5120,M.c,M.a,[[3,M.c],a.NgZone,N.a]),a["\u0275mpd"](5120,M.f,M.e,[[3,M.f],N.a,a.NgZone]),a["\u0275mpd"](4608,L.f,L.f,[M.c,M.f,a.NgZone]),a["\u0275mpd"](5120,L.c,L.g,[[3,L.c],_.DOCUMENT]),a["\u0275mpd"](4608,L.k,L.k,[M.f,_.DOCUMENT]),a["\u0275mpd"](5120,L.d,L.j,[[3,L.d],_.DOCUMENT]),a["\u0275mpd"](4608,L.a,L.a,[L.f,L.c,a.ComponentFactoryResolver,L.k,L.d,a.ApplicationRef,a.Injector,a.NgZone,_.DOCUMENT]),a["\u0275mpd"](5120,L.h,L.i,[L.a]),a["\u0275mpd"](4608,S.i,S.i,[N.a]),a["\u0275mpd"](4608,S.h,S.h,[S.i,a.NgZone,_.DOCUMENT]),a["\u0275mpd"](136192,S.d,S.b,[[3,S.d],_.DOCUMENT]),a["\u0275mpd"](5120,S.l,S.k,[[3,S.l],[2,S.j],_.DOCUMENT]),a["\u0275mpd"](5120,S.g,S.e,[[3,S.g],a.NgZone,N.a]),a["\u0275mpd"](5120,F.b,F.c,[L.a]),a["\u0275mpd"](4608,F.d,F.d,[L.a,a.Injector,[2,_.Location],F.b,[3,F.d]]),a["\u0275mpd"](5120,D.d,D.a,[[3,D.d],[2,T.HttpClient],u.c]),a["\u0275mpd"](5120,X.b,X.g,[L.a]),a["\u0275mpd"](5120,z.c,z.d,[[3,z.c]]),a["\u0275mpd"](4608,O.d,O.d,[N.a]),a["\u0275mpd"](135680,O.a,O.a,[O.d,a.NgZone]),a["\u0275mpd"](4608,P.b,P.b,[L.a,S.l,a.Injector,O.a,[3,P.b]]),a["\u0275mpd"](4608,Q.a,Q.a,[]),a["\u0275mpd"](5120,j.b,j.c,[L.a]),a["\u0275mpd"](5120,U.a,U.c,[]),a["\u0275mpd"](4608,U.b,U.b,[U.a]),a["\u0275mpd"](4608,U.j,U.j,[a.NgZone,_.DOCUMENT]),a["\u0275mpd"](5120,U.k,U.i,[[3,U.k],U.b,U.j]),a["\u0275mpd"](5120,U.n,U.m,[[3,U.n],U.j,U.b]),a["\u0275mpd"](4608,A.a,A.a,[a.ComponentFactoryResolver,a.Injector,K.a]),a["\u0275mpd"](4608,Z.a,Z.a,[]),a["\u0275mpd"](512,l.o,l.o,[[2,l.t],[2,l.l]]),a["\u0275mpd"](512,_.CommonModule,_.CommonModule,[]),a["\u0275mpd"](512,I.u,I.u,[]),a["\u0275mpd"](512,I.j,I.j,[]),a["\u0275mpd"](512,T.HttpClientXsrfModule,T.HttpClientXsrfModule,[]),a["\u0275mpd"](512,T.HttpClientModule,T.HttpClientModule,[]),a["\u0275mpd"](512,V.NgHttpLoaderComponentsModule,V.NgHttpLoaderComponentsModule,[]),a["\u0275mpd"](512,B.NgHttpLoaderServicesModule,B.NgHttpLoaderServicesModule,[]),a["\u0275mpd"](512,Y.NgHttpLoaderModule,Y.NgHttpLoaderModule,[]),a["\u0275mpd"](512,W.e,W.e,[]),a["\u0275mpd"](512,N.b,N.b,[]),a["\u0275mpd"](512,J.d,J.d,[]),a["\u0275mpd"](512,G.b,G.b,[]),a["\u0275mpd"](512,q.a,q.a,[]),a["\u0275mpd"](512,$.g,$.g,[]),a["\u0275mpd"](512,M.b,M.b,[]),a["\u0275mpd"](512,L.e,L.e,[]),a["\u0275mpd"](512,S.a,S.a,[]),a["\u0275mpd"](256,E.e,!0,[]),a["\u0275mpd"](512,E.l,E.l,[[2,E.e]]),a["\u0275mpd"](512,F.i,F.i,[]),a["\u0275mpd"](512,E.w,E.w,[]),a["\u0275mpd"](512,tt.d,tt.d,[]),a["\u0275mpd"](512,nt.f,nt.f,[]),a["\u0275mpd"](512,et.k,et.k,[]),a["\u0275mpd"](512,at.a,at.a,[]),a["\u0275mpd"](512,D.c,D.c,[]),a["\u0275mpd"](512,lt.b,lt.b,[]),a["\u0275mpd"](512,it.a,it.a,[]),a["\u0275mpd"](512,X.e,X.e,[]),a["\u0275mpd"](512,E.n,E.n,[]),a["\u0275mpd"](512,E.u,E.u,[]),a["\u0275mpd"](512,rt.b,rt.b,[]),a["\u0275mpd"](512,ot.d,ot.d,[]),a["\u0275mpd"](512,dt.c,dt.c,[]),a["\u0275mpd"](512,st.b,st.b,[]),a["\u0275mpd"](512,O.c,O.c,[]),a["\u0275mpd"](512,P.d,P.d,[]),a["\u0275mpd"](512,ut.b,ut.b,[]),a["\u0275mpd"](512,Q.b,Q.b,[]),a["\u0275mpd"](512,pt.a,pt.a,[]),a["\u0275mpd"](512,j.d,j.d,[]),a["\u0275mpd"](512,mt.a,mt.a,[]),a["\u0275mpd"](512,U.l,U.l,[]),a["\u0275mpd"](512,U.f,U.f,[]),a["\u0275mpd"](512,ct.a,ct.a,[]),a["\u0275mpd"](512,gt.a,gt.a,[]),a["\u0275mpd"](512,ft.a,ft.a,[]),a["\u0275mpd"](512,ht.a,ht.a,[]),a["\u0275mpd"](512,bt.a,bt.a,[]),a["\u0275mpd"](512,vt.a,vt.a,[]),a["\u0275mpd"](512,yt.a,yt.a,[]),a["\u0275mpd"](512,xt.a,xt.a,[]),a["\u0275mpd"](512,wt.a,wt.a,[]),a["\u0275mpd"](512,Ct.a,Ct.a,[]),a["\u0275mpd"](512,kt.a,kt.a,[]),a["\u0275mpd"](512,Rt.a,Rt.a,[]),a["\u0275mpd"](512,_t.a,_t.a,[]),a["\u0275mpd"](512,It.a,It.a,[]),a["\u0275mpd"](512,Tt.a,Tt.a,[]),a["\u0275mpd"](512,Ht.a,Ht.a,[]),a["\u0275mpd"](512,Et.a,Et.a,[]),a["\u0275mpd"](512,Nt.a,Nt.a,[]),a["\u0275mpd"](512,qt.a,qt.a,[]),a["\u0275mpd"](512,Mt.a,Mt.a,[]),a["\u0275mpd"](512,Lt.a,Lt.a,[]),a["\u0275mpd"](512,St.a,St.a,[]),a["\u0275mpd"](512,Ft.a,Ft.a,[]),a["\u0275mpd"](512,Dt.a,Dt.a,[]),a["\u0275mpd"](512,Xt.a,Xt.a,[]),a["\u0275mpd"](512,zt.a,zt.a,[]),a["\u0275mpd"](512,Ot.a,Ot.a,[]),a["\u0275mpd"](512,i.a,i.a,[]),a["\u0275mpd"](512,c,c,[]),a["\u0275mpd"](256,T["\u0275e"],"XSRF-TOKEN",[]),a["\u0275mpd"](256,T["\u0275f"],"X-XSRF-TOKEN",[]),a["\u0275mpd"](256,lt.a,!1,[]),a["\u0275mpd"](256,X.a,{overlapTrigger:!0,xPosition:"after",yPosition:"below"},[]),a["\u0275mpd"](256,j.a,{showDelay:0,hideDelay:0,touchendHideDelay:1500},[]),a["\u0275mpd"](1024,l.j,function(){return[[{path:"",component:m,pathMatch:"full"}]]},[])])}),nn=a["\u0275crt"]({encapsulation:0,styles:[[""]],data:{animation:[{type:7,name:"fadeInOut",definitions:[{type:1,expr:":enter",animation:[{type:6,styles:{opacity:0},offset:null},{type:4,styles:{type:6,styles:{opacity:1},offset:null},timings:300}],options:null},{type:1,expr:":leave",animation:[{type:4,styles:{type:6,styles:{opacity:0},offset:null},timings:300}],options:null}],options:{}}]}});function en(t){return a["\u0275vid"](0,[(t()(),a["\u0275eld"](0,16777216,null,null,10,"mat-expansion-panel",[["class","mat-expansion-panel"]],[[2,"mat-expanded",null],[2,"mat-expansion-panel-spacing",null]],null,null,jt,Pt)),a["\u0275prd"](6144,null,E.C,null,[st.c]),a["\u0275did"](2,1753088,null,1,st.c,[[8,null],a.ChangeDetectorRef,z.c,a.ViewContainerRef],null,null),a["\u0275qud"](335544320,8,{_lazyContent:0}),(t()(),a["\u0275ted"](-1,1,["\n        "])),(t()(),a["\u0275eld"](5,0,null,0,4,"mat-expansion-panel-header",[["class","mat-expansion-panel-header"],["role","button"]],[[1,"tabindex",0],[1,"aria-controls",0],[1,"aria-expanded",0],[1,"aria-disabled",0],[2,"mat-expanded",null],[40,"@expansionHeight",0]],[[null,"click"],[null,"keyup"]],function(t,n,e){var l=!0;return"click"===n&&(l=!1!==a["\u0275nov"](t,6)._toggle()&&l),"keyup"===n&&(l=!1!==a["\u0275nov"](t,6)._keyup(e)&&l),l},Kt,Ut)),a["\u0275did"](6,180224,null,0,st.e,[st.c,a.ElementRef,S.g,a.ChangeDetectorRef],null,null),a["\u0275pod"](7,{collapsedHeight:0,expandedHeight:1}),a["\u0275pod"](8,{value:0,params:1}),(t()(),a["\u0275ted"](-1,2,["\n          Hint\n        "])),(t()(),a["\u0275ted"](10,1,["\n        ","\n      "])),(t()(),a["\u0275and"](0,null,null,0))],null,function(t,n){var e=n.component;t(n,0,0,a["\u0275nov"](n,2).expanded,a["\u0275nov"](n,2)._hasSpacing()),t(n,5,0,a["\u0275nov"](n,6).panel.disabled?-1:0,a["\u0275nov"](n,6)._getPanelId(),a["\u0275nov"](n,6)._isExpanded(),a["\u0275nov"](n,6).panel.disabled,a["\u0275nov"](n,6)._isExpanded(),t(n,8,0,a["\u0275nov"](n,6)._getExpandedState(),t(n,7,0,a["\u0275nov"](n,6).collapsedHeight,a["\u0275nov"](n,6).expandedHeight))),t(n,10,0,e.selectedQuestion.hint)})}function an(t){return a["\u0275vid"](0,[(t()(),a["\u0275eld"](0,0,null,null,1,"mat-progress-bar",[["aria-valuemax","100"],["aria-valuemin","0"],["class","mat-progress-bar"],["mode","determinate"],["role","progressbar"]],[[1,"aria-valuenow",0],[1,"mode",0],[2,"mat-primary",null],[2,"mat-accent",null],[2,"mat-warn",null]],null,null,Vt,Zt)),a["\u0275did"](1,49152,null,0,ut.a,[],{value:[0,"value"],mode:[1,"mode"]},null)],function(t,n){t(n,1,0,n.component.progress,"determinate")},function(t,n){t(n,0,0,a["\u0275nov"](n,1).value,a["\u0275nov"](n,1).mode,"primary"==a["\u0275nov"](n,1).color,"accent"==a["\u0275nov"](n,1).color,"warn"==a["\u0275nov"](n,1).color)})}function ln(t){return a["\u0275vid"](0,[(t()(),a["\u0275eld"](0,0,null,null,56,"mat-card",[["class","mat-card"]],null,null,null,Yt,Bt)),a["\u0275did"](1,49152,null,0,nt.a,[],null,null),(t()(),a["\u0275ted"](-1,0,["\n    "])),(t()(),a["\u0275eld"](3,0,null,0,2,"mat-card-subtitle",[["class","mat-card-subtitle"]],null,null,null,null,null)),a["\u0275did"](4,16384,null,0,nt.g,[],null,null),(t()(),a["\u0275ted"](5,null,["",""])),(t()(),a["\u0275ted"](-1,0,["\n    "])),(t()(),a["\u0275eld"](7,0,null,0,2,"mat-card-title",[["class","mat-card-title"]],null,null,null,null,null)),a["\u0275did"](8,16384,null,0,nt.h,[],null,null),(t()(),a["\u0275ted"](9,null,["",""])),(t()(),a["\u0275ted"](-1,0,["\n    "])),(t()(),a["\u0275eld"](11,0,null,0,25,"mat-card-content",[["class","mat-card-content"]],null,null,null,null,null)),a["\u0275did"](12,16384,null,0,nt.c,[],null,null),(t()(),a["\u0275ted"](-1,null,["\n      "])),(t()(),a["\u0275eld"](14,0,null,null,18,"mat-form-field",[["class","mat-input-container mat-form-field"],["style","width: 100%;"]],[[2,"mat-input-invalid",null],[2,"mat-form-field-invalid",null],[2,"mat-form-field-can-float",null],[2,"mat-form-field-should-float",null],[2,"mat-form-field-hide-placeholder",null],[2,"mat-form-field-disabled",null],[2,"mat-focused",null],[2,"mat-primary",null],[2,"mat-accent",null],[2,"mat-warn",null],[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],null,null,Wt.b,Wt.a)),a["\u0275did"](15,7389184,null,7,J.b,[a.ElementRef,a.ChangeDetectorRef,[2,E.h]],null,null),a["\u0275qud"](335544320,1,{_control:0}),a["\u0275qud"](335544320,2,{_placeholderChild:0}),a["\u0275qud"](335544320,3,{_labelChild:0}),a["\u0275qud"](603979776,4,{_errorChildren:1}),a["\u0275qud"](603979776,5,{_hintChildren:1}),a["\u0275qud"](603979776,6,{_prefixChildren:1}),a["\u0275qud"](603979776,7,{_suffixChildren:1}),(t()(),a["\u0275ted"](-1,1,["\n        "])),(t()(),a["\u0275eld"](24,0,null,1,7,"textarea",[["autofocus",""],["class","mat-input-element mat-form-field-autofill-control"],["matInput",""],["placeholder","Answer"],["rows","15"]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null],[2,"mat-input-server",null],[1,"id",0],[8,"placeholder",0],[8,"disabled",0],[8,"required",0],[8,"readOnly",0],[1,"aria-describedby",0],[1,"aria-invalid",0],[1,"aria-required",0]],[[null,"ngModelChange"],[null,"input"],[null,"blur"],[null,"compositionstart"],[null,"compositionend"],[null,"focus"]],function(t,n,e){var l=!0,i=t.component;return"input"===n&&(l=!1!==a["\u0275nov"](t,25)._handleInput(e.target.value)&&l),"blur"===n&&(l=!1!==a["\u0275nov"](t,25).onTouched()&&l),"compositionstart"===n&&(l=!1!==a["\u0275nov"](t,25)._compositionStart()&&l),"compositionend"===n&&(l=!1!==a["\u0275nov"](t,25)._compositionEnd(e.target.value)&&l),"blur"===n&&(l=!1!==a["\u0275nov"](t,30)._focusChanged(!1)&&l),"focus"===n&&(l=!1!==a["\u0275nov"](t,30)._focusChanged(!0)&&l),"input"===n&&(l=!1!==a["\u0275nov"](t,30)._onInput()&&l),"ngModelChange"===n&&(l=!1!==(i.answer=e)&&l),l},null,null)),a["\u0275did"](25,16384,null,0,I.d,[a.Renderer2,a.ElementRef,[2,I.a]],null,null),a["\u0275prd"](1024,null,I.l,function(t){return[t]},[I.d]),a["\u0275did"](27,671744,null,0,I.q,[[8,null],[8,null],[8,null],[2,I.l]],{model:[0,"model"]},{update:"ngModelChange"}),a["\u0275prd"](2048,null,I.m,null,[I.q]),a["\u0275did"](29,16384,null,0,I.n,[I.m],null,null),a["\u0275did"](30,933888,null,0,G.a,[a.ElementRef,N.a,[2,I.m],[2,I.p],[2,I.i],E.d,[8,null]],{placeholder:[0,"placeholder"]},null),a["\u0275prd"](2048,[[1,4]],J.c,null,[G.a]),(t()(),a["\u0275ted"](-1,1,["\n      "])),(t()(),a["\u0275ted"](-1,null,["\n      "])),(t()(),a["\u0275and"](16777216,null,null,1,null,en)),a["\u0275did"](35,16384,null,0,_.NgIf,[a.ViewContainerRef,a.TemplateRef],{ngIf:[0,"ngIf"]},null),(t()(),a["\u0275ted"](-1,null,["\n    "])),(t()(),a["\u0275ted"](-1,0,["\n    "])),(t()(),a["\u0275eld"](38,0,null,0,1,"mat-divider",[["class","mat-divider"],["role","separator"]],[[1,"aria-orientation",0],[2,"mat-divider-vertical",null],[2,"mat-divider-inset",null]],null,null,Gt,Jt)),a["\u0275did"](39,49152,null,0,rt.a,[],null,null),(t()(),a["\u0275ted"](-1,0,["\n    "])),(t()(),a["\u0275eld"](41,0,null,0,2,"mat-card-actions",[["class","mat-card-actions"]],[[2,"mat-card-actions-align-end",null]],null,null,null,null)),a["\u0275did"](42,16384,null,0,nt.b,[],null,null),(t()(),a["\u0275ted"](-1,null,["\n    "])),(t()(),a["\u0275ted"](-1,0,["\n    "])),(t()(),a["\u0275eld"](45,0,null,1,10,"mat-card-footer",[["class","mat-card-footer"]],null,null,null,null,null)),a["\u0275did"](46,16384,null,0,nt.d,[],null,null),(t()(),a["\u0275ted"](-1,null,["\n      "])),(t()(),a["\u0275eld"](48,0,null,null,3,"button",[["class","mat-button"],["mat-button",""]],[[8,"disabled",0]],[[null,"click"]],function(t,n,e){var a=!0;return"click"===n&&(a=!1!==t.component.submitQuestion()&&a),a},$t.b,$t.a)),a["\u0275did"](49,180224,null,0,tt.b,[a.ElementRef,N.a,S.g],null,null),a["\u0275did"](50,16384,null,0,tt.c,[],null,null),(t()(),a["\u0275ted"](-1,0,["Submit"])),(t()(),a["\u0275ted"](-1,null,["\n      "])),(t()(),a["\u0275and"](16777216,null,null,1,null,an)),a["\u0275did"](54,16384,null,0,_.NgIf,[a.ViewContainerRef,a.TemplateRef],{ngIf:[0,"ngIf"]},null),(t()(),a["\u0275ted"](-1,null,["\n    "])),(t()(),a["\u0275ted"](-1,0,["\n  "]))],function(t,n){var e=n.component;t(n,27,0,e.answer),t(n,30,0,"Answer"),t(n,35,0,e.giveHint),t(n,54,0,e.timeLimit)},function(t,n){var e=n.component;t(n,5,0,e.selectedQuestion.category),t(n,9,0,e.selectedQuestion.question),t(n,14,1,[a["\u0275nov"](n,15)._control.errorState,a["\u0275nov"](n,15)._control.errorState,a["\u0275nov"](n,15)._canLabelFloat,a["\u0275nov"](n,15)._shouldLabelFloat(),a["\u0275nov"](n,15)._hideControlPlaceholder(),a["\u0275nov"](n,15)._control.disabled,a["\u0275nov"](n,15)._control.focused,"primary"==a["\u0275nov"](n,15).color,"accent"==a["\u0275nov"](n,15).color,"warn"==a["\u0275nov"](n,15).color,a["\u0275nov"](n,15)._shouldForward("untouched"),a["\u0275nov"](n,15)._shouldForward("touched"),a["\u0275nov"](n,15)._shouldForward("pristine"),a["\u0275nov"](n,15)._shouldForward("dirty"),a["\u0275nov"](n,15)._shouldForward("valid"),a["\u0275nov"](n,15)._shouldForward("invalid"),a["\u0275nov"](n,15)._shouldForward("pending")]),t(n,24,1,[a["\u0275nov"](n,29).ngClassUntouched,a["\u0275nov"](n,29).ngClassTouched,a["\u0275nov"](n,29).ngClassPristine,a["\u0275nov"](n,29).ngClassDirty,a["\u0275nov"](n,29).ngClassValid,a["\u0275nov"](n,29).ngClassInvalid,a["\u0275nov"](n,29).ngClassPending,a["\u0275nov"](n,30)._isServer,a["\u0275nov"](n,30).id,a["\u0275nov"](n,30).placeholder,a["\u0275nov"](n,30).disabled,a["\u0275nov"](n,30).required,a["\u0275nov"](n,30).readonly,a["\u0275nov"](n,30)._ariaDescribedby||null,a["\u0275nov"](n,30).errorState,a["\u0275nov"](n,30).required.toString()]),t(n,38,0,a["\u0275nov"](n,39).vertical?"vertical":"horizontal",a["\u0275nov"](n,39).vertical,a["\u0275nov"](n,39).inset),t(n,41,0,"end"===a["\u0275nov"](n,42).align),t(n,48,0,a["\u0275nov"](n,49).disabled||null)})}function rn(t){return a["\u0275vid"](0,[(t()(),a["\u0275eld"](0,0,null,null,1,"h4",[["class","text-center text-muted lead"]],null,null,null,null,null)),(t()(),a["\u0275ted"](1,null,[""," of ",""]))],null,function(t,n){var e=n.component;t(n,1,0,e.selectedId+1,e.test.questions.length)})}function on(t){return a["\u0275vid"](0,[(t()(),a["\u0275eld"](0,0,null,null,10,"div",[],null,[[null,"keydown"]],function(t,n,e){var a=!0;return"keydown"===n&&(a=!1!==t.component.keyDownFunction(e)&&a),a},null,null)),(t()(),a["\u0275ted"](-1,null,["\n  "])),(t()(),a["\u0275and"](16777216,null,null,1,null,ln)),a["\u0275did"](3,16384,null,0,_.NgIf,[a.ViewContainerRef,a.TemplateRef],{ngIf:[0,"ngIf"]},null),(t()(),a["\u0275ted"](-1,null,["\n  "])),(t()(),a["\u0275eld"](5,0,null,null,4,"div",[],null,null,null,null,null)),(t()(),a["\u0275ted"](-1,null,["\n    "])),(t()(),a["\u0275and"](16777216,null,null,1,null,rn)),a["\u0275did"](8,16384,null,0,_.NgIf,[a.ViewContainerRef,a.TemplateRef],{ngIf:[0,"ngIf"]},null),(t()(),a["\u0275ted"](-1,null,["\n  "])),(t()(),a["\u0275ted"](-1,null,["\n"]))],function(t,n){var e=n.component;t(n,3,0,e.selectedQuestion),t(n,8,0,e.selectedQuestion)},null)}function dn(t){return a["\u0275vid"](0,[(t()(),a["\u0275eld"](0,0,null,null,4,"div",[],[[24,"@fadeInOut",0]],null,null,null,null)),(t()(),a["\u0275ted"](-1,null,["\n"])),(t()(),a["\u0275and"](16777216,null,null,1,null,on)),a["\u0275did"](3,16384,null,0,_.NgIf,[a.ViewContainerRef,a.TemplateRef],{ngIf:[0,"ngIf"]},null),(t()(),a["\u0275ted"](-1,null,["\n"]))],function(t,n){t(n,3,0,n.component.test)},function(t,n){t(n,0,0,void 0)})}function sn(t){return a["\u0275vid"](0,[(t()(),a["\u0275eld"](0,0,null,null,4,"div",[["style","padding:10px;"]],null,null,null,null,null)),(t()(),a["\u0275ted"](-1,null,["\n"])),(t()(),a["\u0275and"](16777216,null,null,1,null,dn)),a["\u0275did"](3,16384,null,0,_.NgIf,[a.ViewContainerRef,a.TemplateRef],{ngIf:[0,"ngIf"]},null),(t()(),a["\u0275ted"](-1,null,["\n"]))],function(t,n){var e=n.component;t(n,3,0,e.selectedQuestion&&e.test)},null)}function un(t){return a["\u0275vid"](0,[(t()(),a["\u0275eld"](0,0,null,null,1,"app-live-test",[],null,null,null,sn,nn)),a["\u0275did"](1,245760,null,0,m,[l.a,l.l,r.a,u.i,p.a],null,null)],function(t,n){t(n,1,0)},null)}var pn=a["\u0275ccf"]("app-live-test",m,un,{},{},[])}});