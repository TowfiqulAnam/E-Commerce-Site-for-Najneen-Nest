export type Product = {id:string; name:string; category:string; description:string; price:number; discount:number; stock:number; image:string; active:boolean; sample:boolean};
export type Settings = {phone:string; email:string; facebook:string; delivery:string; payment:string; returns:string; privacy:string; shipping:number; live:boolean};
export type Order = {id:string; key:string; name:string; phone:string; address:string; items:{id:string;name:string;qty:number;unit:number}[]; subtotal:number;shipping:number;total:number;promotion:string;status:string;paid:boolean;created:string};
export type Promotion = {id:string;code:string;percent:number;active:boolean;ends:string};
export type Store = {products:Product[];orders:Order[];requests:{id:string;name:string;phone:string;message:string;status:string;created:string}[];expenses:{id:string;label:string;amount:number;date:string}[];promotions:Promotion[];settings:Settings};
export const categories = ['All finds','Fashion','Home care','Accessories','Kids','Pets'];
export const statuses = ['New','Confirmed','Packed','Shipped','Delivered','Cancelled'];
export const money = (n:number) => new Intl.NumberFormat('en-BD',{style:'currency',currency:'BDT',maximumFractionDigits:2}).format(n/100);
export const salePrice = (p:Product) => Math.round(p.price*(100-p.discount)/100);
export function initialStore():Store {return {products:[],orders:[],requests:[],expenses:[],promotions:[],settings:{phone:'01521572770',email:'',facebook:'',delivery:'',payment:'',returns:'',privacy:'',shipping:0,live:false}};}
export const samples:Product[] = [
 {id:'sample-vase',name:'The sculptural vase',category:'Home care',description:'A sample home accent for exploring the store. Replace with your actual product details, materials, size and photographs before selling.',price:125000,discount:20,stock:0,image:'/art/vase.svg',active:true,sample:true},
 {id:'sample-bag',name:'Everyday carry tote',category:'Fashion',description:'Sample fashion listing. Add real material, dimensions and available colours in the dashboard.',price:89000,discount:0,stock:0,image:'/art/bag.svg',active:true,sample:true},
 {id:'sample-lamp',name:'A little glow lamp',category:'Accessories',description:'Sample accessory listing. Verify specifications and safety information before publishing a real product.',price:159000,discount:10,stock:0,image:'/art/lamp.svg',active:true,sample:true},
 {id:'sample-blocks',name:'Little moments play set',category:'Kids',description:'Sample kids listing. Specify age suitability, materials and safety guidance for your actual product.',price:75000,discount:0,stock:0,image:'/art/blocks.svg',active:true,sample:true},
 {id:'sample-bowl',name:'Happy paws bowl',category:'Pets',description:'Sample pet listing. Replace with verified product measurements and care instructions.',price:65000,discount:0,stock:0,image:'/art/bowl.svg',active:true,sample:true},
 {id:'sample-tray',name:'The everyday organiser',category:'Home care',description:'Sample home care listing. Add accurate dimensions, colours and photos before launch.',price:98000,discount:15,stock:0,image:'/art/tray.svg',active:true,sample:true}
];
export function validateProduct(p:Product){if(!p || !/^[a-zA-Z0-9_-]{1,80}$/.test(p.id)||!p.name?.trim()||p.name.length>120||!categories.slice(1).includes(p.category)||typeof p.description!=='string'||p.description.length>3000||!Number.isSafeInteger(p.price)||p.price<1||p.price>100000000||!Number.isInteger(p.discount)||p.discount<0||p.discount>95||!Number.isInteger(p.stock)||p.stock<0||p.stock>100000||typeof p.active!=='boolean'||typeof p.sample!=='boolean'||typeof p.image!=='string'||!(p.image.startsWith('/art/')||/^https:\/\//.test(p.image)))throw new Error('Invalid product. Check ID, category, price, discount, stock and HTTPS image URL.');}
export function quote(s:Store, items:{id:string;qty:number}[],code:string){
 if(!Array.isArray(items)||items.length<1||items.length>30||new Set(items.map(i=>i.id)).size!==items.length)throw new Error('Choose 1–30 distinct items.');
 const lines=items.map(i=>{const p=s.products.find(p=>p.id===i.id&&p.active&&!p.sample);if(!p||!Number.isInteger(i.qty)||i.qty<1||i.qty>99||p.stock<i.qty)throw new Error('An item is unavailable or has insufficient stock. Refresh your cart.');return {id:p.id,name:p.name,qty:i.qty,unit:salePrice(p)};});
 const promotion=code?s.promotions.find(p=>p.active&&p.code===code.toUpperCase()&&p.ends>=new Date().toISOString().slice(0,10)):undefined;
 if(code&&!promotion)throw new Error('This promotion code is invalid or expired.');
 const subtotal=lines.reduce((a,l)=>a+l.unit*l.qty,0);const saving=Math.round(subtotal*(promotion?.percent||0)/100);
 return {lines,subtotal,saving,shipping:s.settings.shipping,total:subtotal-saving+s.settings.shipping,promotion:promotion?.code||''};
}
