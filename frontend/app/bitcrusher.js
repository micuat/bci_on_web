// !function(e){
//   if("object"==typeof exports)
//   module.exports=e();
// else if("function"==typeof define&&define.amd)
// define(e);
// else{
//   var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.bitcrusher=e()}
// }


export default (function(){var define,module,exports;return function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}({1:[function(_dereq_,module,exports){var floor=Math.floor;function clamp(min,max,v){if(v<min)return min;if(v>max)return max;return v}module.exports=function(audioContext,opts){opts=opts||{};var bufferSize=opts.bufferSize||4096,channelCount=opts.channelCount||2,bits=clamp(1,Infinity,(opts.bitDepth||8)|0),normFreq=clamp(0,1,opts.frequency||1),step=2*Math.pow(.5,bits),invStep=1/step,phasor=0,last=0;var processor=audioContext.createScriptProcessor(bufferSize,channelCount,channelCount);processor.onaudioprocess=function(evt){var ib=evt.inputBuffer,ob=evt.outputBuffer;for(var i=0;i<channelCount;++i){var id=ib.getChannelData(i),od=ob.getChannelData(i);for(var s=0,l=ob.length;s<l;++s){phasor+=normFreq;if(phasor>=1){phasor-=1;last=step*floor(id[s]*invStep+.5)}od[s]=last}}};Object.defineProperty(processor,"bitDepth",{get:function(){return bits},set:function(v){bits=v;step=2*Math.pow(.5,bits);invStep=1/step}});Object.defineProperty(processor,"frequency",{get:function(){return normFreq},set:function(v){normFreq=clamp(0,1,v)}});return processor}},{}]},{},[1])(1)})();