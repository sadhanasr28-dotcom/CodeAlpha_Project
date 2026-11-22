const API = "/api";
let products = [], activeCategory = "All", cart = JSON.parse(localStorage.getItem("shopease_cart") || "[]");
let token = localStorage.getItem("shopease_token"), currentUser = JSON.parse(localStorage.getItem("shopease_user") || "null");
const $ = id => document.getElementById(id);
const money = n => "₹" + Number(n).toLocaleString("en-IN");
function saveCart(){localStorage.setItem("shopease_cart",JSON.stringify(cart));$("cartCount").textContent=cart.reduce((s,i)=>s+i.quantity,0)}
function toast(message){$("toast").textContent=message;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),2400)}
async function api(path, options={}) {
  const headers={"Content-Type":"application/json",...(options.headers||{})};
  if(token) headers.Authorization=`Bearer ${token}`;
  const response=await fetch(API+path,{...options,headers});
  const data=await response.json().catch(()=>({message:"Unexpected server response"}));
  if(!response.ok) throw new Error(data.message||"Something went wrong");
  return data;
}
async function loadProducts(){
  const search=encodeURIComponent($("searchInput").value.trim());
  try{const data=await api(`/products?category=${encodeURIComponent(activeCategory)}&search=${search}`);products=data.products;renderProducts();}
  catch(e){$("productGrid").innerHTML=`<p class="muted">${e.message}. Start the server and seed the database.</p>`;}
}
function renderProducts(){
  $("productGrid").innerHTML=products.length?products.map(p=>`
    <article class="product-card">
      <img class="product-image" src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" data-detail="${p._id}" onerror="this.src='https://placehold.co/600x400?text=Product'">
      <div class="product-info"><span class="category">${escapeHtml(p.category)}</span><h3>${escapeHtml(p.name)}</h3>
      <div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add-btn" data-add="${p._id}">Add to cart</button></div></div>
    </article>`).join(""):'<p class="muted">No products found.</p>';
  document.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>addToCart(b.dataset.add));
  document.querySelectorAll("[data-detail]").forEach(i=>i.onclick=()=>showProduct(i.dataset.detail));
}
function escapeHtml(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function addToCart(id){const p=products.find(x=>x._id===id);if(!p)return;const found=cart.find(x=>x.productId===id);if(found)found.quantity++;else cart.push({productId:id,name:p.name,price:p.price,image:p.image,quantity:1});saveCart();toast("Added to cart");}
function openModal(html){$("modalContent").innerHTML=html;$("modalOverlay").classList.remove("hidden")}
function closeModal(){$("modalOverlay").classList.add("hidden")}
$("closeModal").onclick=closeModal;$("modalOverlay").onclick=e=>{if(e.target===$("modalOverlay"))closeModal()};
async function showProduct(id){try{const {product:p}=await api(`/products/${id}`);openModal(`<p class="eyebrow">${escapeHtml(p.category)}</p><h2>${escapeHtml(p.name)}</h2><img src="${escapeHtml(p.image)}" style="width:100%;height:210px;object-fit:cover;border-radius:6px"><p>${escapeHtml(p.description)}</p><p><b>${money(p.price)}</b> · ${p.stock} in stock</p><button class="full-btn" id="detailAdd">Add to cart</button>`);$("detailAdd").onclick=()=>{addToCart(p._id);closeModal()};}catch(e){toast(e.message)}}
function showAuth(mode="login"){
 const register=mode==="register";
 openModal(`<h2>${register?"Create an account":"Welcome back"}</h2><form id="authForm">
 ${register?'<div class="form-field"><label>Full name</label><input name="name" required maxlength="80" placeholder="Your name"></div>':""}
 <div class="form-field"><label>Email address</label><input name="email" type="email" required placeholder="you@example.com"></div>
 <div class="form-field"><label>Password</label><input name="password" type="password" minlength="6" required placeholder="At least 6 characters"></div>
 <button class="full-btn">${register?"Register":"Login"}</button></form>
 <p class="switch-auth">${register?"Already have an account?":"New to ShopEase?"} <button class="link-btn" id="switchAuth">${register?"Login":"Register"}</button></p>`);
 $("switchAuth").onclick=()=>showAuth(register?"login":"register");
 $("authForm").onsubmit=async e=>{e.preventDefault();const body=Object.fromEntries(new FormData(e.target));try{const data=await api(`/auth/${register?"register":"login"}`,{method:"POST",body:JSON.stringify(body)});token=data.token;currentUser=data.user;localStorage.setItem("shopease_token",token);localStorage.setItem("shopease_user",JSON.stringify(currentUser));closeModal();updateAccount();loadOrders();toast("Welcome, "+currentUser.name+"!");}catch(err){toast(err.message)}};
}
function updateAccount(){$("accountBtn").textContent=currentUser?`Hi, ${currentUser.name.split(" ")[0]} · Logout`:"Login / Register";}
$("accountBtn").onclick=()=>{if(currentUser){token=null;currentUser=null;localStorage.removeItem("shopease_token");localStorage.removeItem("shopease_user");updateAccount();$("ordersList").innerHTML='<p class="muted">Log in to view your orders.</p>';toast("Logged out");}else showAuth();};
function showCart(){
 const total=cart.reduce((s,i)=>s+i.price*i.quantity,0);
 openModal(`<h2>Your shopping cart</h2>${cart.length?cart.map(i=>`<div class="cart-row"><div><b>${escapeHtml(i.name)}</b><small>${money(i.price)} each</small></div><div class="qty-controls"><button data-dec="${i.productId}">−</button>${i.quantity}<button data-inc="${i.productId}">+</button><button data-remove="${i.productId}">×</button></div></div>`).join(""):`<p class="muted">Your cart is empty. Add a product to get started.</p>`}
 ${cart.length?`<div class="cart-total"><span>Total</span><span>${money(total)}</span></div><button class="full-btn" id="checkoutBtn">Continue to checkout</button>`:""}`);
 document.querySelectorAll("[data-dec]").forEach(b=>b.onclick=()=>changeQty(b.dataset.dec,-1));
 document.querySelectorAll("[data-inc]").forEach(b=>b.onclick=()=>changeQty(b.dataset.inc,1));
 document.querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>{cart=cart.filter(i=>i.productId!==b.dataset.remove);saveCart();showCart()});
 if($("checkoutBtn"))$("checkoutBtn").onclick=showCheckout;
}
function changeQty(id,delta){const item=cart.find(i=>i.productId===id);if(item){item.quantity+=delta;if(item.quantity<1)cart=cart.filter(i=>i.productId!==id);}saveCart();showCart();}
function showCheckout(){
 if(!currentUser){toast("Please log in before checkout");showAuth();return;}
 const total=cart.reduce((s,i)=>s+i.price*i.quantity,0);
 openModal(`<h2>Checkout</h2><p class="muted">Order total: <b>${money(total)}</b></p><form id="checkoutForm"><div class="form-field"><label>Shipping address</label><textarea name="shippingAddress" required minlength="8" placeholder="House number, street, city, state and PIN code"></textarea></div><button class="full-btn">Place order</button></form><p class="muted" style="font-size:12px">Demo project: no real payment is collected.</p>`);
 $("checkoutForm").onsubmit=async e=>{e.preventDefault();const shippingAddress=new FormData(e.target).get("shippingAddress");try{const result=await api("/orders",{method:"POST",body:JSON.stringify({shippingAddress,items:cart.map(i=>({productId:i.productId,quantity:i.quantity}))})});cart=[];saveCart();closeModal();toast(result.message);loadOrders();document.getElementById("orders").scrollIntoView();}catch(err){toast(err.message)}};
}
async function loadOrders(){
 if(!token)return;
 try{const {orders}=await api("/orders/my-orders");$("ordersList").innerHTML=orders.length?orders.map(o=>`<article class="order-card"><b>Order #${o._id.slice(-8).toUpperCase()}</b><p>${new Date(o.createdAt).toLocaleString()} · ${o.status} · ${money(o.total)}</p><p>${o.items.map(i=>`${escapeHtml(i.name)} × ${i.quantity}`).join(", ")}</p><p>Ship to: ${escapeHtml(o.shippingAddress)}</p></article>`).join(""):'<p class="muted">You have not placed any orders yet.</p>';}
 catch(e){$("ordersList").innerHTML=`<p class="muted">${e.message}</p>`;}
}
$("cartBtn").onclick=showCart;$("searchInput").addEventListener("input",loadProducts);
$("filters").onclick=e=>{const b=e.target.closest("[data-category]");if(!b)return;activeCategory=b.dataset.category;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));loadProducts();};
updateAccount();saveCart();loadProducts();loadOrders();
