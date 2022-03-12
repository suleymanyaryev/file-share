var U=Object.defineProperty,ee=Object.defineProperties;var te=Object.getOwnPropertyDescriptors;var I=Object.getOwnPropertySymbols;var ne=Object.prototype.hasOwnProperty,se=Object.prototype.propertyIsEnumerable;var J=(e,n,s)=>n in e?U(e,n,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[n]=s,D=(e,n)=>{for(var s in n||(n={}))ne.call(n,s)&&J(e,s,n[s]);if(I)for(var s of I(n))se.call(n,s)&&J(e,s,n[s]);return e},B=(e,n)=>ee(e,te(n));import{r as oe,o as u,c as q,d as R,u as ae,a as d,b as i,e as N,t as _,f as y,g as $,F as O,n as P,h as ie,i as ce,j as C,k as re,l as z,m as V,w as ue,T as le,p as de,q as fe,s as pe,v as me,x as ye}from"./vendor.4ec24005.js";const ve=function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))o(t);new MutationObserver(t=>{for(const r of t)if(r.type==="childList")for(const p of r.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&o(p)}).observe(document,{childList:!0,subtree:!0});function s(t){const r={};return t.integrity&&(r.integrity=t.integrity),t.referrerpolicy&&(r.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?r.credentials="include":t.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(t){if(t.ep)return;t.ep=!0;const r=s(t);fetch(t.href,r)}};ve();var he=(e,n)=>{const s=e.__vccOpts||e;for(const[o,t]of n)s[o]=t;return s};const we={};function xe(e,n){const s=oe("RouterView");return u(),q(s)}var ge=he(we,[["render",xe]]);const Ce=R({setup(e){const n=ae(),s=Math.random().toString(36).slice(2);return n.push({name:"room-view",params:{roomId:s}}),(o,t)=>(u(),d("div"))}}),_e={class:"relative max-w-100 w-full h-60 flex items-center justify-center rounded-xl border-2 border-white border-dashed cursor-pointer"},Se=i("div",{class:"text-center text-2xl text-white"},[N(" Browse or "),i("br"),N(" Drag&Drop files here ")],-1),$e={name:"BaseFileInput"},Re=R(B(D({},$e),{emits:["new-file"],setup(e,{emit:n}){function s(o){const t=o.target,r=[...Array.from(t.files||[])];r.length!==0&&(n("new-file",r[0]),t.value="")}return(o,t)=>(u(),d("div",_e,[i("input",{type:"file",class:"absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer",onChange:s},null,32),Se]))}}));function M(e,n=20){let s=String(e),o="";const t=s.lastIndexOf(".");return t!==-1&&(o=s.substring(t),s=s.substring(0,t)),s.length>n&&(s=`${s.substr(0,Math.floor((n-3)/2))}...${s.substr(s.length-Math.floor((n-3)/2))}`),`${s}${o}`}const be={class:"px-0.5 py-1.5"},ke={class:"h-20 py-2 px-4 w-full flex flex-col bg-white shadow-md rounded-md"},Oe={class:"flex mb-2 text-sm"},Ne={class:"ml-auto"},Te=["disabled"],Ae=["disabled"],Le=["disabled"],qe={class:"relative h-1.5 w-full bg-gray-300 rounded-2xl overflow-hidden"},Fe={class:"flex"},Ie={class:"mr-auto w-6 relative"},Je={class:"absolute bottom-0 left-0 text-xs whitespace-nowrap"},De=N(" Status: "),Be={class:"font-bold"},Pe={class:"ml-auto text-center w-6"},ze=R({props:{item:{type:Object,required:!0}},emits:["pause","cancel","resume","remove"],setup(e){return(n,s)=>(u(),d("div",be,[i("div",ke,[i("div",Oe,[i("span",null,_(y(M)(e.item.filename,18)),1),i("div",Ne,[e.item.status==="in-progress"?(u(),d("button",{key:0,disabled:e.item.type==="in",class:"mx-0.5 px-1 rounded-sm bg-yellow-500 text-white text-xs disabled:opacity-75",onClick:s[0]||(s[0]=o=>n.$emit("pause"))}," pause ",8,Te)):$("",!0),e.item.status==="paused"?(u(),d(O,{key:1},[i("button",{class:"mx-0.5 px-1.5 rounded-sm bg-orange-500 text-white text-xs disabled:opacity-75",disabled:e.item.type==="in",onClick:s[1]||(s[1]=o=>n.$emit("cancel"))}," cancel ",8,Ae),i("button",{class:"mx-0.5 px-1.5 rounded-sm bg-green-600 text-white text-xs disabled:opacity-75",disabled:e.item.type==="in",onClick:s[2]||(s[2]=o=>n.$emit("resume"))}," resume ",8,Le)],64)):$("",!0),e.item.status==="canceled"||e.item.status==="completed"?(u(),d("button",{key:2,class:"mx-0.5 px-1.5 rounded-sm bg-red-500 text-white text-xs",onClick:s[3]||(s[3]=o=>n.$emit("remove"))}," remove ")):$("",!0)])]),i("div",qe,[i("div",{class:P(["absolute w-full h-full transform origin-left rounded-2xl scale-x-50",{"bg-blue-500":e.item.status==="in-progress","bg-green-500":e.item.status==="completed","bg-orange-400":e.item.status==="paused","bg-red-500":e.item.status==="canceled"}]),style:ie({transform:`scaleX(${e.item.status==="canceled"?1:e.item.progress})`})},null,6)]),i("div",Fe,[i("span",Ie,[i("div",Je,[De,i("span",Be,_(e.item.status),1)])]),i("span",{class:P(["mt-1 text-xs text-center",{"text-white":e.item.status==="canceled"||e.item.status==="completed"}])},_((e.item.progress*100).toFixed(2))+"% ",3),i("span",Pe,_(e.item.type==="out"?"->":"<-"),1)])])]))}}),Ve={class:"px-0.5 py-1.5"},Ee={class:"h-20 py-2 px-4 w-full flex flex-col bg-white shadow-md rounded-md"},Me={class:"flex mb-2 text-sm"},je={class:"ml-auto"},We=ce('<div class="relative h-1.5 w-full bg-gray-300 rounded-2xl overflow-hidden"><div class="absolute w-full h-full bg-blue-500 transform origin-left rounded-2xl scale-x-0"></div></div><div class="flex"><span class="mr-auto w-6"></span><span class="mt-1 text-xs text-center"> pending </span><span class="ml-auto text-center w-6"> -&gt; </span></div>',2),He=R({props:{item:{type:Object,required:!0}},emits:["remove"],setup(e){return(n,s)=>(u(),d("div",Ve,[i("div",Ee,[i("div",Me,[i("span",null,_(y(M)(e.item.name,15)),1),i("div",je,[i("button",{class:"mx-0.5 px-1.5 rounded-sm bg-red-500 text-white text-xs",onClick:s[0]||(s[0]=o=>n.$emit("remove"))}," remove ")])]),We])]))}});function Ge(e){return{ws:new WebSocket(e),pc:null,dc:null,isConnected:C(!1),isSending:C(!1),isReceiving:C(!1),history:C([]),queue:C([])}}const k=64*1024,E=12*1024*1024;function Qe(e){let n=!1;function s(){if(e.queue.value.length>0){const a=e.queue.value[0];e.queue.value=e.queue.value.slice(1),o(a)}}function o(a){if(!e.dc||!e.isConnected.value)return;if(e.isSending.value){e.queue.value.push(a);return}e.isSending.value=!0;const c=a.name,l=a.type,v=a.size,x=Math.trunc(v/k)+(v%k!==0?1:0);e.dc.bufferedAmountLowThreshold=Math.trunc(E/8),e.dc.send(JSON.stringify({type:"start-sending",payload:{name:c,type:l,size:v,length:x}})),e.history.value.push({type:"out",status:"in-progress",file:a,blob:null,filename:c,filetype:l,filesize:v,length:x,count:0,progress:0});const S=e.history.value[e.history.value.length-1];f(S)}function t(a){const c=e.history.value[a];c.status="paused",n=!0}function r(a){const c=e.history.value[a];c.status="in-progress",e.dc.send(JSON.stringify({type:"resumed"})),f(c)}function p(a){const c=e.history.value[a];c.status="canceled",c.file=null,e.isSending.value=!1,n=!1,e.dc.send(JSON.stringify({type:"canceled"})),setTimeout(s,1e3)}function f(a){function c(){e.dc.removeEventListener("bufferedamountlow",c),l()}async function l(){for(;a.count<a.length;){if(n){n=!1,e.dc.send(JSON.stringify({type:"paused"}));return}if(e.dc.bufferedAmount>E){e.dc.addEventListener("bufferedamountlow",c);return}const v=a.count*k,x=v+k,S=await a.file.slice(v,x).arrayBuffer();e.dc.send(S),a.count++,a.progress=a.count/a.length}e.dc.send(JSON.stringify({type:"complete-sending"})),a.status="completed",a.file=null,e.isSending.value=!1,n=!1,setTimeout(s)}l()}return{sendFile:o,pauseSending:t,resumeSending:r,cancelSending:p}}function Ye(e){let n=null;function s(o){if(typeof o.data=="string"){const t=JSON.parse(o.data);if(t.type==="start-sending"){if(e.isReceiving.value)return;e.isReceiving.value=!0,e.history.value.push({type:"in",status:"in-progress",file:null,blob:new Blob,filename:t.payload.name,filetype:t.payload.type,filesize:t.payload.size,length:t.payload.length,count:0,progress:0}),n=e.history.value[e.history.value.length-1]}t.type==="paused"&&(n.status="paused"),t.type==="resumed"&&(n.status="in-progress"),t.type==="canceled"&&(n.status="canceled",e.isReceiving.value=!1,n.blob=null),t.type==="complete-sending"&&(n.status="completed",re.exports.saveAs(n.blob,n.filename),e.isReceiving.value=!1,n.blob=null)}o.data instanceof ArrayBuffer&&(n.count++,n.progress=n.count/n.length,n.blob=new Blob([n.blob,o.data],{type:n.type}))}return{receiveFile:s}}function Ze(e){function n(o){const t=o.target;t===e.pc&&(t.connectionState==="connected"&&(e.isConnected.value=!0),(t.connectionState==="disconnected"||t.connectionState==="failed")&&(e.isConnected.value=!1))}function s(o){o.candidate&&e.ws.send(JSON.stringify({type:"client-ice-candidate",payload:{iceCandidate:o.candidate}}))}return{onConnectionStateChange:n,onLocalIceCandidate:s}}const j={iceServers:[{urls:"stun:stun01.sipphone.com"},{urls:"stun:stun.ekiga.net"},{urls:"stun:stun.fwdnet.net"},{urls:"stun:stun.ideasip.com"},{urls:"stun:stun.iptel.org"},{urls:"stun:stun.rixtelecom.se"},{urls:"stun:stun.schlund.de"},{urls:"stun:stun.l.google.com:19302"},{urls:"stun:stun1.l.google.com:19302"},{urls:"stun:stun2.l.google.com:19302"},{urls:"stun:stun3.l.google.com:19302"},{urls:"stun:stun4.l.google.com:19302"},{urls:"stun:stunserver.org"},{urls:"stun:stun.softjoys.com"},{urls:"stun:stun.voiparound.com"},{urls:"stun:stun.voipbuster.com"},{urls:"stun:stun.voipstunt.com"},{urls:"stun:stun.voxgratia.org"},{urls:"stun:stun.xten.com"},{urls:"turn:numb.viagenie.ca",credential:"muazkh",username:"webrtc@live.com"},{urls:"turn:192.158.29.39:3478?transport=udp",credential:"JZEOEt2V3Qb0y27GRntt2u2PAYA=",username:"28224511:1379330808"},{urls:"turn:192.158.29.39:3478?transport=tcp",credential:"JZEOEt2V3Qb0y27GRntt2u2PAYA=",username:"28224511:1379330808"}]};function Ke(e,n,s,o,t){async function r(){e.pc=new RTCPeerConnection(j),p();const f=await e.pc.createOffer();await e.pc.setLocalDescription(f),e.ws.send(JSON.stringify({type:"client-offer",payload:{offer:f}})),e.pc.onicecandidate=o,e.pc.onconnectionstatechange=s}async function p(){e.dc=e.pc.createDataChannel("file-share"),e.dc.binaryType="arraybuffer",e.dc.onopen=()=>{console.log("local dc opened")},e.dc.onmessage=async f=>{n(f)},e.dc.onerror=f=>{console.log("local dc error"),console.log(f)},e.dc.onclose=()=>{console.log("local dc closed"),e.pc.close(),t()}}return{initConnection:r}}function Xe(e,n,s,o,t){function r(c){!e.pc||e.pc.setRemoteDescription(new RTCSessionDescription(c.answer))}function p(c){!e.pc||e.pc.addIceCandidate(new RTCIceCandidate(c.iceCandidate))}function f(c){e.dc=c.channel,e.dc.binaryType="arraybuffer",e.dc.onopen=()=>{console.log("remote dc opened")},e.dc.onmessage=async l=>{n(l)},e.dc.onerror=l=>{console.log("remote dc error"),console.log(l)},e.dc.onclose=()=>{console.log("remote dc close"),e.pc.close(),t()}}async function a({offer:c}){e.pc=new RTCPeerConnection(j),e.pc.ondatachannel=f,await e.pc.setRemoteDescription(new RTCSessionDescription(c));const l=await e.pc.createAnswer();await e.pc.setLocalDescription(l),e.ws.send(JSON.stringify({type:"client-answer",payload:{answer:l}})),e.pc.onicecandidate=o,e.pc.onconnectionstatechange=s}return{onRemoteAnswer:r,onRemoteIceCandidate:p,onRemoteOffer:a}}const Ue={class:"h-screen flex flex-col items-center p-5 w-full bg-blue-200"},et={key:0,class:"max-w-100 w-full mt-5 bg-gray-100 p-2 rounded-xl"},tt={class:"p-1 max-h-100 overflow-y-auto scroll-hidden"},nt={key:1,class:"text-center my-auto text-2xl relative"},st=N(" Copy and Share this link "),ot=i("br",null,null,-1),at={key:0,class:"absolute left-1/2 top-full transform -translate-x-1/2 translate-y-2 text-base text-green-600 select-none"},it=R({setup(e){const s=de().params.roomId,o=window.location.href,t=Ge(`wss://test.belli.studio/${s}`),{sendFile:r,pauseSending:p,resumeSending:f,cancelSending:a}=Qe(t),{receiveFile:c}=Ye(t),{onConnectionStateChange:l,onLocalIceCandidate:v}=Ze(t),{initConnection:x}=Ke(t,c,l,v,F),{onRemoteAnswer:S,onRemoteIceCandidate:H,onRemoteOffer:G}=Xe(t,c,l,v,F);t.ws.onopen=()=>{console.log("WS open"),t.ws.send(JSON.stringify({type:"client-connected"}))},t.ws.onerror=()=>{console.log("WS error")},t.ws.onclose=()=>{console.log("WS close")},t.ws.onmessage=m=>{const h=JSON.parse(m.data);h.type==="client-connected"&&x(),h.type==="client-answer"&&S(h.payload),h.type==="client-offer"&&G(h.payload),h.type==="client-ice-candidate"&&H(h.payload)};const{history:g,queue:T,isConnected:Q}=t;function F(){t.pc=null,t.dc=null,t.history.value=[],t.queue.value=[],t.isConnected.value=!1,t.isSending.value=!1,t.isReceiving.value=!1,t.history.value=[],t.queue.value=[]}function Y(m){g.value[m].type==="out"&&p(m)}function Z(m){g.value[m].type==="out"&&f(m)}function K(m){g.value[m].type==="out"&&a(m)}const A=C(!1);function X(){fe(o),A.value=!0,setTimeout(()=>{A.value=!1},1500)}return(m,h)=>(u(),d("div",Ue,[y(Q)?(u(),d(O,{key:0},[z(Re,{onNewFile:y(r)},null,8,["onNewFile"]),y(g).length>0||y(T).length>0?(u(),d("div",et,[i("div",tt,[(u(!0),d(O,null,V(y(g),(L,w)=>(u(),q(ze,{key:w,item:L,onPause:b=>Y(w),onResume:b=>Z(w),onCancel:b=>K(w),onRemove:b=>y(g).splice(w,1)},null,8,["item","onPause","onResume","onCancel","onRemove"]))),128)),(u(!0),d(O,null,V(y(T),(L,w)=>(u(),q(He,{key:w,item:L,onRemove:b=>y(T).splice(w,1)},null,8,["item","onRemove"]))),128))])])):$("",!0)],64)):(u(),d("h1",nt,[st,ot,i("span",{class:"text-blue-800 cursor-pointer",onClick:X},_(y(o)),1),z(le,{"enter-active-class":"transition-opacity duration-150","leave-active-class":"transition-opacity duration-150","enter-from-class":"opacity-0","leave-to-class":"opacity-0"},{default:ue(()=>[A.value?(u(),d("span",at," Copied! ")):$("",!0)]),_:1})]))]))}}),ct=[{path:"/",name:"main-view",component:Ce},{path:"/room/:roomId",name:"room-view",component:it}],rt=pe({history:me(),routes:ct});const W=ye(ge);W.use(rt);W.mount("#app");
