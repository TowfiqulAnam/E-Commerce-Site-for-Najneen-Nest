import {test} from 'node:test';
import assert from 'node:assert/strict';
import {initialStore,quote,validateProduct} from '../lib/store.ts';
const p={id:'test',name:'Test product',category:'Home care',description:'Test',price:10000,discount:10,stock:3,image:'/art/vase.svg',active:true,sample:false};
test('server quote uses authoritative price and stacks a valid promotion before shipping',()=>{const s=initialStore();s.products=[p];s.settings.shipping=1000;s.promotions=[{id:'p',code:'SAVE',percent:20,ends:'2099-01-01',active:true}];assert.deepEqual(quote(s,[{id:'test',qty:2}],'SAVE'),{lines:[{id:'test',name:'Test product',qty:2,unit:9000}],subtotal:18000,saving:3600,shipping:1000,total:15400,promotion:'SAVE'});});
test('overselling, duplicate IDs, negative quantities and preview products are rejected',()=>{const s=initialStore();s.products=[p];for(const items of [[{id:'test',qty:4}],[{id:'test',qty:-1}],[{id:'test',qty:1},{id:'test',qty:1}]])assert.throws(()=>quote(s,items,''));s.products=[{...p,sample:true}];assert.throws(()=>quote(s,[{id:'test',qty:1}],''));});
test('unavailable promotions cannot change order totals',()=>{const s=initialStore();s.products=[p];s.promotions=[{id:'p',code:'OLD',percent:30,ends:'2000-01-01',active:true}];assert.throws(()=>quote(s,[{id:'test',qty:1}],'OLD'));});
test('product imports reject unsafe URLs and fractional stock',()=>{validateProduct(p);assert.throws(()=>validateProduct({...p,image:'javascript:alert(1)'}));assert.throws(()=>validateProduct({...p,stock:1.5}));assert.throws(()=>validateProduct({...p,discount:100}));});
