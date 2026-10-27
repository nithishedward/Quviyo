const videos = [
  {
    id: "-ZnYdmreOrk",
    title: "A video picked just for you",
    channel: "Your shared video",
    views: "A little something to watch",
    duration: "Watch now",
    category: "Music",
    color: "#7651a8",
    icon: "Y"
  },
  {
    id: "ysz5S6PUM-U",
    title: "Chilled Serenity #5",
    channel: "Xquisite",
    views: "Ambient music",
    duration: "Watch now",
    category: "Music",
    color: "#d47c75",
    icon: "L"
  },
  {
    id: "jNQXAC9IVRw",
    title: "Me at the zoo",
    channel: "jawed",
    views: "The first video on YouTube",
    duration: "0:19",
    category: "Learning",
    color: "#458d84",
    icon: "J"
  },
  {
    id: "aqz-KE-bpKQ",
    title: "Big Buck Bunny - Open Movie",
    channel: "Blender",
    views: "A short animated film",
    duration: "9:56",
    category: "Animation",
    color: "#6192a8",
    icon: "B"
  },
  {
    id: "ScMzIvxBSi4",
    title: "Placeholder Video",
    channel: "BenMarquezTX",
    views: "A short video",
    duration: "Watch now",
    category: "Music",
    color: "#bd5b66",
    icon: "R"
  },
  {
    id: "M7lc1UVf-VE",
    title: "YouTube player demo",
    channel: "YouTube Developers",
    views: "A quick video player example",
    duration: "Demo",
    category: "Learning",
    color: "#5267a6",
    icon: "Y"
  },
  {
    id: "2Vv-BfVoq4g",
    title: "Ed Sheeran - Perfect (Official Music Video)",
    channel: "Ed Sheeran",
    views: "Music video",
    duration: "Watch now",
    category: "Music",
    color: "#a75069",
    icon: "E"
  },
  {
    id: "fLexgOxsZu0",
    title: "Bruno Mars - The Lazy Song (Official Music Video)",
    channel: "Bruno Mars",
    views: "Music video",
    duration: "Watch now",
    category: "Music",
    color: "#bd7650",
    icon: "B"
  },
  {
    id: "iCvmsMzlF7o",
    title: "The Power of Vulnerability | Brené Brown | TED",
    channel: "TED",
    views: "Talk · Ideas worth spreading",
    duration: "Watch now",
    category: "Learning",
    color: "#ce453c",
    icon: "T"
  },
  {
    id: "qp0HIF3SfI4",
    title: "How Great Leaders Inspire Action | Simon Sinek | TED",
    channel: "TED",
    views: "Talk · Ideas worth spreading",
    duration: "Watch now",
    category: "Learning",
    color: "#ce453c",
    icon: "T"
  },
  {
    id: "YQHsXMglC9A",
    title: "Adele - Hello (Official Music Video)",
    channel: "Adele",
    views: "Music video",
    duration: "Watch now",
    category: "Music",
    color: "#524365",
    icon: "A"
  },
  {
    id: "arj7oStGLkU",
    title: "Inside the Mind of a Master Procrastinator | Tim Urban | TED",
    channel: "TED",
    views: "Talk · Ideas worth spreading",
    duration: "Watch now",
    category: "Learning",
    color: "#ce453c",
    icon: "T"
  }
];

const grid=document.querySelector("#video-grid"), searchInput=document.querySelector("#search-input"), searchForm=document.querySelector(".search");
const categoryButtons=[...document.querySelectorAll(".category")], status=document.querySelector("#search-status"), count=document.querySelector("#result-count"), empty=document.querySelector("#empty-state"), loadMore=document.querySelector("#load-more"), homeMore=document.querySelector("#home-load-more"), homeSentinel=document.querySelector("#home-feed-sentinel");
const saved=readState(); let routeName="home", activeCategory="All", query="", apiVideos=[], pending=[], pageToken="", generation=0, loading=false, currentVideo=null, currentChannel=null, miniVideo=null, pendingPlaylist=null, toastTimer, homePageToken="", homePending=[], homeLoading=false, homeEnd=false, homeObserver=null, homeFailed=false, homeInitialized=false;
const pageSize=50, showCount=12, categoryIds={Music:"10",Learning:"27",Animation:"1"};
function readState(){try{return JSON.parse(localStorage.getItem("quviyo-state")||"{}")}catch{return {}}}
function saveState(){localStorage.setItem("quviyo-state",JSON.stringify(saved))}
function list(key){return Array.isArray(saved[key])?saved[key]:(saved[key]=[])}
function snapshot(v){return {...v,thumbnail:v.thumbnail||`https://i.ytimg.com/vi/${encodeURIComponent(v.id)}/hqdefault.jpg`}}
function allVideos(){const m=new Map();[...videos,...apiVideos,...pending,...list("history"),...list("watchLater"),...list("liked")].filter(Boolean).forEach(v=>m.set(v.id,v));Object.values(saved.playlists||{}).flat().forEach(v=>m.set(v.id,v));return [...m.values()]}
function isSaved(key,id){return list(key).some(v=>v.id===id)}
function escapeHtml(x){return String(x||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function viewsText(v){const n=Number(v);if(!Number.isFinite(n))return v||"";if(n>=1e9)return `${(n/1e9).toFixed(1)}B views`;if(n>=1e6)return `${(n/1e6).toFixed(1)}M views`;if(n>=1e3)return `${(n/1e3).toFixed(1)}K views`;return `${n} views`}
function ageText(v){if(!v)return "";const n=Math.floor((Date.now()-new Date(v).getTime())/86400000);if(!Number.isFinite(n))return "";return n<1?"today":n<7?`${n}d ago`:n<30?`${Math.floor(n/7)}w ago`:n<365?`${Math.floor(n/30)}mo ago`:`${Math.floor(n/365)}y ago`}
function cards(container,items,compact=false){container.replaceChildren(...items.map(v=>makeCard(v,compact)))}
function makeCard(v,compact=false){
 const card=document.createElement("article");card.className=`video-card${compact?" compact-card":""}`;
 const open=document.createElement("button");open.className="video-open";open.type="button";open.dataset.openVideo=v.id;open.setAttribute("aria-label",`Watch ${v.title}`);
 const thumb=document.createElement("span");thumb.className="thumbnail";const img=document.createElement("img");img.src=v.thumbnail||`https://i.ytimg.com/vi/${encodeURIComponent(v.id)}/hqdefault.jpg`;img.alt="";img.loading="lazy";thumb.append(img);
 const play=document.createElement("span");play.className="play-overlay";play.innerHTML="<span>▶</span>";thumb.append(play);const duration=document.createElement("span");duration.className="duration";duration.textContent=v.duration||"▶";thumb.append(duration);open.append(thumb);
 const info=document.createElement("div");info.className="video-info";const av=document.createElement("button");av.className="channel-avatar";av.type="button";av.dataset.channelFor=v.id;av.setAttribute("aria-label",`Open ${v.channel} channel`);av.style.setProperty("--avatar-color",v.color||"#7654a8");av.textContent=v.icon||v.channel.slice(0,1).toUpperCase();
 if(v.channelAvatar){const picture=document.createElement("img");picture.src=v.channelAvatar;picture.alt="";picture.loading="lazy";picture.onerror=()=>picture.remove();av.append(picture)}
 const copy=document.createElement("div");copy.className="video-copy";const title=document.createElement("button");title.className="video-title";title.type="button";title.dataset.openVideo=v.id;title.textContent=v.title;
 const channel=document.createElement("button");channel.className="channel-name";channel.type="button";channel.dataset.channelFor=v.id;channel.textContent=v.channel;
 const meta=document.createElement("p");meta.className="video-meta";meta.textContent=[v.viewCount?viewsText(v.viewCount):v.views,ageText(v.publishedAt)].filter(Boolean).join(" · ");copy.append(title,channel,meta);if(routeName==="search"&&v.description){const desc=document.createElement("p");desc.className="video-description";desc.textContent=v.description;copy.append(desc)}info.append(av,copy);
 const actions=document.createElement("div");actions.className="card-actions";const more=document.createElement("button");more.className="video-more";more.type="button";more.dataset.menuFor=v.id;more.setAttribute("aria-label","More video actions");more.textContent="⋮";
 const menu=document.createElement("div");menu.className="video-menu";menu.hidden=true;menu.innerHTML=`<button data-action="later" data-id="${escapeHtml(v.id)}">◴　${isSaved("watchLater",v.id)?"Remove from Watch later":"Save to Watch later"}</button><button data-action="like" data-id="${escapeHtml(v.id)}">♡　${isSaved("liked",v.id)?"Unlike":"Like"}</button><button data-action="playlist" data-id="${escapeHtml(v.id)}">▱　Add to playlist</button><button data-action="share" data-id="${escapeHtml(v.id)}">↗　Share</button>`;actions.append(more,menu);card.append(open,info,actions);return card;
}
function renderFeed(){
 let items=routeName==="search"?apiVideos:routeName==="channel"?channelFeed:videos;
 if(routeName==="library")items=list(librarySection==="history"?"history":librarySection==="watch-later"?"watchLater":"liked");
 if(routeName==="subscriptions")items=list("subscriptions").flatMap(s=>allVideos().filter(v=>(v.channelId||v.channel)===s.id));
 if(routeName==="category"&&activeCategory!=="All")items=videos.filter(v=>v.category===activeCategory);
 if(routeName==="home"&&searchInput.value.trim())items=videos.filter(v=>`${v.title} ${v.channel}`.toLowerCase().includes(searchInput.value.trim().toLowerCase()));
 if(routeName==="home"&&activeCategory!=="All")items=items.filter(v=>v.category===activeCategory);
 cards(grid,items);count.textContent=`${items.length} ${items.length===1?"video":"videos"}`;
 empty.hidden=items.length>0||loading;
 loadMore.hidden=routeName!=="search"||(!pending.length&&!pageToken);loadMore.disabled=loading;
 const onHome=["home","category"].includes(routeName);
 homeMore.hidden=!onHome||(homeEnd&&!homePending.length);homeMore.disabled=homeLoading;homeMore.textContent=homeLoading?"Loading more videos…":homeFailed?"Retry loading videos":"Load more videos";
 homeSentinel.hidden=!onHome||(homeEnd&&!homePending.length);
 document.body.classList.toggle("search-results",routeName==="search");
 if(loading&&!items.length){grid.innerHTML=Array.from({length:6},()=>'<div class="skeleton-card"><span></span><i></i><i></i></div>').join("")}
}function toast(message){const el=document.querySelector("#toast");el.textContent=message;el.classList.add("visible");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("visible"),2500)}
function remember(v){saved.history=[snapshot(v),...list("history").filter(x=>x.id!==v.id)].slice(0,100);saveState()}
function openWatch(id){const v=allVideos().find(x=>x.id===id);if(!v)return;currentVideo=v;remember(v);navigate(`#watch/${encodeURIComponent(id)}`)}
function openChannel(id){currentChannel=allVideos().find(x=>x.id===id);if(currentChannel)navigate(`#channel/${encodeURIComponent(id)}`)}
function navigate(hash){if(location.hash===hash)route();else location.hash=hash}
let librarySection="history",channelFeed=[];
function route(){
 const previous=routeName;
 const raw=location.hash.slice(1)||"home",[path,params=""]=raw.split("?"),[section,id]=path.split("/");routeName=section||"home";if(previous==="watch"&&section!=="watch"&&!miniVideo){const frame=document.querySelector("#watch-player");frame.replaceChildren();frame.dataset.videoId="";}
 const q=new URLSearchParams(params).get("q")||"";const views={home:"home-view",shorts:"home-view",category:"home-view",search:"home-view",watch:"watch-view",channel:"channel-view",library:"library-view",subscriptions:"subscriptions-view"};
 document.querySelector("#home-view").hidden=!["home","shorts","category","search"].includes(section);document.querySelector("#watch-view").hidden=section!=="watch";document.querySelector("#channel-view").hidden=section!=="channel";document.querySelector("#library-view").hidden=section!=="library";document.querySelector("#subscriptions-view").hidden=section!=="subscriptions";
 document.querySelector("#categories").hidden=!["home","shorts","category","search"].includes(section);
 document.querySelector("#shorts-shelf").hidden=!["home","shorts"].includes(section);document.querySelector("#videos-heading").textContent=section==="search"?`Results for “${q}”`:section==="category"?`${decodeURIComponent(id||"")} videos`:section==="shorts"?"Shorts":"Videos for you";
 document.querySelectorAll(".side-link[data-route]").forEach(a=>a.classList.toggle("selected",a.dataset.route===section||a.dataset.route===`${section}/${id}`));
 if(section==="search"){searchInput.value=q;if(q&&q!==lastQuery)startSearch(q,false);else renderFeed()}
 else if(section==="watch"){const v=allVideos().find(x=>x.id===decodeURIComponent(id||""))||currentVideo;if(v)renderWatch(v)}
 else if(section==="channel"){const v=allVideos().find(x=>x.id===decodeURIComponent(id||""))||currentChannel;if(v)renderChannel(v)}
 else if(section==="library"){librarySection=id||"history";renderLibrary(librarySection)}
 else if(section==="subscriptions")renderSubscriptions();
 else {if(section==="home"){activeCategory="All";categoryButtons.forEach(b=>b.classList.toggle("active",b.dataset.category==="All"))}if(section==="category"){activeCategory=decodeURIComponent(id||"All");categoryButtons.forEach(b=>b.classList.toggle("active",b.dataset.category===activeCategory))}if(section==="shorts")requestAnimationFrame(()=>document.querySelector("#shorts-shelf").scrollIntoView({behavior:"smooth"}));renderFeed()}
}
function renderWatch(v){
 currentVideo=v;if(miniVideo&&miniVideo.id!==v.id)stopMini();const frame=document.querySelector("#watch-player");
 if(miniVideo?.id===v.id){const iframe=document.querySelector("#mini-player-frame iframe");frame.replaceChildren();if(iframe)frame.append(iframe);document.querySelector("#mini-player").hidden=true;miniVideo=null}
 else if(frame.dataset.videoId!==v.id){if(miniVideo)stopMini();frame.dataset.videoId=v.id;frame.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.id)}?autoplay=1&controls=1&rel=0" title="${escapeHtml(v.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`}
 const subscribed=list("subscriptions").some(s=>s.id===(v.channelId||v.channel));
 document.querySelector("#watch-details").innerHTML=`<h1 class="watch-title">${escapeHtml(v.title)}</h1><div class="watch-action-row"><div class="watch-channel"><button class="channel-avatar large-avatar" data-channel-for="${escapeHtml(v.id)}" type="button">${v.channelAvatar?`<img src="${escapeHtml(v.channelAvatar)}" alt="">`:escapeHtml(v.icon||v.channel.slice(0,1).toUpperCase())}</button><div><button class="watch-channel-name" data-channel-for="${escapeHtml(v.id)}" type="button">${escapeHtml(v.channel)}</button><span class="channel-subs">${v.subscriberCount?viewsText(v.subscriberCount).replace(" views"," subscribers"):"YouTube channel"}</span></div><button class="subscribe-button ${subscribed?"subscribed":""}" data-subscribe="${escapeHtml(v.id)}" type="button">${subscribed?"Subscribed":"Subscribe"}</button></div><div class="watch-buttons"><button class="watch-action ${isSaved("liked",v.id)?"active":""}" data-watch="like" type="button">${isSaved("liked",v.id)?"♥ Liked":"♡ Like"}</button><button class="watch-action" data-watch="share" type="button">↗ Share</button><button class="watch-action ${isSaved("watchLater",v.id)?"active":""}" data-watch="later" type="button">◴ Save</button><button class="watch-action" data-watch="mini" type="button">▣ Miniplayer</button></div></div><div class="watch-description"><strong>${v.viewCount?viewsText(v.viewCount):"Recommended for you"}${v.publishedAt?` · ${ageText(v.publishedAt)}`:""}</strong><p id="description-text">${escapeHtml(v.description||v.views||"Watch this video on Quviyo.")}</p><button id="description-toggle" type="button">Show more</button></div>`;
 renderComments(v.id);cards(document.querySelector("#up-next-list"),allVideos().filter(x=>x.id!==v.id).slice(0,12),true);
}
function renderChannel(v){currentChannel=v;const key=v.channelId||v.channel,subscribed=list("subscriptions").some(s=>s.id===key);document.querySelector("#channel-header").innerHTML=`<div class="channel-banner"></div><div class="channel-profile"><div class="channel-profile-avatar">${v.channelAvatar?`<img src="${escapeHtml(v.channelAvatar)}" alt="">`:escapeHtml(v.icon||v.channel.slice(0,1).toUpperCase())}</div><div class="channel-profile-copy"><h1>${escapeHtml(v.channel)}</h1><p>@${escapeHtml(v.channel.replace(/\s/g,""))} · ${v.subscriberCount?viewsText(v.subscriberCount).replace(" views"," subscribers"):"YouTube channel"}</p><p>${escapeHtml(v.description||"Videos from this channel, collected on Quviyo.")}</p></div><button class="subscribe-button ${subscribed?"subscribed":""}" data-subscribe="${escapeHtml(v.id)}" type="button">${subscribed?"Subscribed":"Subscribe"}</button></div>`;channelFeed=allVideos().filter(x=>v.channelId?x.channelId===v.channelId:x.channel===v.channel);if(!channelFeed.length)channelFeed=[v];cards(document.querySelector("#channel-grid"),channelFeed)}
function renderLibrary(section){const names={history:"History",playlists:"Playlists","watch-later":"Watch later",liked:"Liked videos"};document.querySelector("#library-heading").textContent=names[section]||"Your library";document.querySelector("#clear-library").hidden=section!=="history";const grid=document.querySelector("#library-grid"),pv=document.querySelector("#playlists-view");grid.hidden=section==="playlists";pv.hidden=section!=="playlists";let items=section==="history"?list("history"):section==="watch-later"?list("watchLater"):section==="liked"?list("liked"):[];if(section!=="playlists")cards(grid,items);else{pv.replaceChildren();for(const [name,savedVideos] of Object.entries(saved.playlists||{})){const group=document.createElement("section");group.className="playlist-group";group.innerHTML=`<h2>${escapeHtml(name)} · ${savedVideos.length} videos</h2>`;const row=document.createElement("div");row.className="video-grid";cards(row,savedVideos);group.append(row);pv.append(group)}if(!Object.keys(saved.playlists||{}).length)pv.innerHTML='<p class="empty-state">No playlists yet. Use a video menu to create one.</p>'}document.querySelector("#library-empty").hidden=section==="playlists"||items.length>0}
function renderSubscriptions(){const items=list("subscriptions").flatMap(s=>allVideos().filter(v=>(v.channelId||v.channel)===s.id));cards(document.querySelector("#subscriptions-grid"),items);document.querySelector("#subscriptions-empty").hidden=items.length>0}
function renderComments(id){const all=saved.comments||{},comments=all[id]||[];document.querySelector("#comments-heading").textContent=`${comments.length} comments · saved on this device`;const box=document.querySelector("#comments-list");box.replaceChildren(...comments.map(text=>{const p=document.createElement("p");p.className="comment-item";p.textContent=text;return p}))}
function apiKey(){const key=window.YOUTUBE_API_KEY;if(typeof key!=="string"||!key.trim()||key.includes("YOUR_API_KEY"))throw new Error("Add your YouTube Data API key in config.js, then reload.");return key.trim()}
function durationText(iso){const m=/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso||"");if(!m)return "";const s=+(m[3]||0)+60*+(m[2]||0)+3600*+(m[1]||0);return `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`}
function normalize(item){const id=item.id?.videoId||item.id,s=item.snippet;if(!id||!s)return null;const t=s.thumbnails?.high?.url||s.thumbnails?.medium?.url||s.thumbnails?.default?.url;return{id,title:s.title||"Untitled video",channel:s.channelTitle||"YouTube channel",channelId:s.channelId||"",category:s.categoryId==="10"?"Music":s.categoryId==="1"?"Animation":"Learning",thumbnail:t||"",description:s.description||"",publishedAt:s.publishedAt||"",viewCount:item.statistics?.viewCount||"",duration:durationText(item.contentDetails?.duration),color:"#6547a8",icon:(s.channelTitle||"Y").slice(0,1).toUpperCase()}}
async function fetchSearchPage(token,active){const p=new URLSearchParams({key:apiKey(),part:"snippet",q:lastQuery,type:"video",videoEmbeddable:"true",maxResults:String(pageSize)});if(token)p.set("pageToken",token);if(categoryIds[activeCategory])p.set("videoCategoryId",categoryIds[activeCategory]);const r=await fetch(`https://www.googleapis.com/youtube/v3/search?${p}`),d=await r.json();if(!r.ok)throw Error(d.error?.message||`YouTube search failed (${r.status})`);if(active!==generation)return null;const items=d.items||[],ids=items.map(x=>x.id?.videoId).filter(Boolean);let details=[];if(ids.length){const dp=new URLSearchParams({key:apiKey(),part:"snippet,status,contentDetails,statistics",id:ids.join(",")});const dr=await fetch(`https://www.googleapis.com/youtube/v3/videos?${dp}`),dd=await dr.json();if(!dr.ok)throw Error(dd.error?.message||"Could not load video details");if(active!==generation)return null;const map=new Map((dd.items||[]).map(x=>[x.id,x]));details=items.map(x=>{const d=map.get(x.id.videoId);if(!d||d.status?.embeddable!==true||d.snippet?.liveBroadcastContent!=="none")return null;return normalize({id:x.id,snippet:{...x.snippet,categoryId:d.snippet.categoryId},statistics:d.statistics,contentDetails:d.contentDetails})}).filter(Boolean)}
 if(active!==generation)return null;const channels=[...new Set(details.map(v=>v.channelId).filter(Boolean))];if(channels.length){try{const cp=new URLSearchParams({key:apiKey(),part:"snippet,statistics",id:channels.join(",")});const cr=await fetch(`https://www.googleapis.com/youtube/v3/channels?${cp}`),cd=await cr.json();if(cr.ok){const av=new Map((cd.items||[]).map(c=>[c.id,c.snippet?.thumbnails?.default?.url||""]));details.forEach(v=>{const c=(cd.items||[]).find(x=>x.id===v.channelId);v.channelAvatar=av.get(v.channelId)||"";v.subscriberCount=c?.statistics?.subscriberCount||""})}}catch{}}
 pending.push(...details);return d.nextPageToken||""}
async function loadSearch(replace){const active=generation;loading=true;setStatus(replace?"Searching YouTube…":"Loading more videos…");renderFeed();try{if(replace||(!pending.length&&pageToken)){const next=await fetchSearchPage(replace?"":pageToken,active);if(active!==generation)return;pageToken=next||""}if(active!==generation)return;const page=pending.splice(0,showCount);apiVideos=replace?page:apiVideos.concat(page);setStatus(apiVideos.length?"":"No embeddable videos found. Try another search.")}catch(e){if(active===generation)setStatus(e.message||"Search failed",true)}finally{if(active===generation){loading=false;renderFeed()}}}
let lastQuery="";
function startSearch(q,update=true){q=q.trim();if(!q){toast("Type something to search for.");return}lastQuery=q;apiVideos=[];pending=[];pageToken="";generation++;routeName="search";if(update)navigate(`#search?q=${encodeURIComponent(q)}`);loadSearch(true)}
function setStatus(message,error=false){status.textContent=message;status.classList.toggle("error",error)}
function renderFreshShorts(suggestions){
  const candidates=suggestions.filter(video=>{const parts=(video.duration||"").split(":").map(Number);if(parts.some(Number.isNaN)||parts.length<2)return false;const seconds=parts.length===3?parts[0]*3600+parts[1]*60+parts[2]:parts[0]*60+parts[1];return seconds<=60;});
  const chosen=[...candidates];
  for(const video of suggestions){if(chosen.length>=5)break;if(!chosen.some(item=>item.id===video.id))chosen.push(video);}
  const rail=document.querySelector(".shorts-rail");
  rail.replaceChildren(...chosen.slice(0,5).map(video=>{
    const card=document.createElement("button");card.className="short-card";card.type="button";card.dataset.shortVideoId=video.id;card.dataset.shortTitle=video.title;
    const thumb=document.createElement("span");thumb.className="short-thumb";const image=document.createElement("img");image.src=video.thumbnail||`https://i.ytimg.com/vi/${encodeURIComponent(video.id)}/hqdefault.jpg`;image.alt="";image.loading="lazy";thumb.append(image);
    const play=document.createElement("span");play.className="short-play";play.textContent="▶";thumb.append(play);
    const title=document.createElement("span");title.className="short-copy";title.textContent=video.title;card.append(thumb,title);return card;
  }));
}
async function fetchHomePage(token=""){
  const params=new URLSearchParams({key:apiKey(),part:"snippet,status,contentDetails,statistics",chart:"mostPopular",regionCode:"IN",maxResults:"50"});if(token)params.set("pageToken",token);
  const response=await fetch(`https://www.googleapis.com/youtube/v3/videos?${params}`),data=await response.json();if(!response.ok)throw Error(data.error?.message||`Couldn't get more suggestions (${response.status}).`);
  const items=(data.items||[]).filter(item=>item.status?.embeddable===true&&item.snippet?.liveBroadcastContent!=="live").map(normalize).filter(Boolean);
  const channelIds=[...new Set(items.map(video=>video.channelId).filter(Boolean))];if(channelIds.length){try{const cp=new URLSearchParams({key:apiKey(),part:"snippet,statistics",id:channelIds.join(",")});const cr=await fetch(`https://www.googleapis.com/youtube/v3/channels?${cp}`),cd=await cr.json();if(cr.ok){const byId=new Map((cd.items||[]).map(c=>[c.id,c]));items.forEach(video=>{const channel=byId.get(video.channelId);video.channelAvatar=channel?.snippet?.thumbnails?.default?.url||"";video.subscriberCount=channel?.statistics?.subscriberCount||""})}}catch{}}
  return {items,nextPageToken:data.nextPageToken||""};
}
function shuffleVideos(items){for(let i=items.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[items[i],items[j]]=[items[j],items[i]];}return items;}
async function loadHomeMore(initial=false){
  if(homeLoading||homeEnd||homeFailed&&!initial)return;homeLoading=true;setStatus(initial?"Refreshing video suggestions…":"Loading more videos…");renderFeed();
  try{
    if(initial||(!homePending.length&&homePageToken)){const page=await fetchHomePage(initial?"":homePageToken);homePageToken=page.nextPageToken;const known=new Set(videos.map(v=>v.id));homePending.push(...shuffleVideos(page.items).filter(v=>!known.has(v.id)));}
    if(initial){if(!homePending.length)throw Error("YouTube didn't return embeddable suggestions.");const first=homePending.splice(0,24);videos.splice(0,videos.length,...first);renderFreshShorts(first);homeInitialized=true;}
    else if(homePending.length){const known=new Set(videos.map(v=>v.id));const batch=homePending.splice(0,12).filter(v=>!known.has(v.id));videos.push(...batch);}
    homeFailed=false;if(!homePending.length&&!homePageToken)homeEnd=true;setStatus(homeEnd?"You've reached the end of the available suggestions.":"");
  }catch(error){homeFailed=true;setStatus(initial?"Couldn't refresh suggestions. Showing the sample videos instead.":`Couldn't load more videos. ${error.message||"Try again."}`,true);}
  finally{homeLoading=false;renderFeed();}
}
function loadHomeSuggestions(){homePageToken="";homePending=[];homeEnd=false;loadHomeMore(true)}
function action(actionName,v){if(actionName==="later"||actionName==="like"){const key=actionName==="later"?"watchLater":"liked",add=!isSaved(key,v.id),items=list(key),i=items.findIndex(x=>x.id===v.id);if(add)items.unshift(snapshot(v));else if(i>=0)items.splice(i,1);saveState();toast(add?(key==="liked"?"Added to Liked videos":"Saved to Watch later"):"Removed");route()}else if(actionName==="playlist"){pendingPlaylist=v;showPlaylists()}else if(actionName==="share"){const link=`${location.href.split("#")[0]}#watch/${encodeURIComponent(v.id)}`;navigator.clipboard?.writeText(link).then(()=>toast("Video link copied")).catch(()=>toast(link))}}
function showPlaylists(){const box=document.querySelector("#playlist-options");box.replaceChildren();for(const [name,items] of Object.entries(saved.playlists||{})){const b=document.createElement("button");b.className="playlist-option";b.type="button";b.textContent=`▱ ${name}`;b.addEventListener("click",()=>{if(pendingPlaylist&&!items.some(v=>v.id===pendingPlaylist.id)){items.unshift(snapshot(pendingPlaylist));saveState()}document.querySelector("#playlist-dialog").close();toast(`Added to ${name}`)});box.append(b)}document.querySelector("#playlist-dialog").showModal()}
function stopMini(){const iframe=document.querySelector("#mini-player-frame iframe");if(iframe)iframe.src="";document.querySelector("#mini-player-frame").replaceChildren();document.querySelector("#mini-player").hidden=true;miniVideo=null}
function minimize(){const iframe=document.querySelector("#watch-player iframe");if(!iframe||!currentVideo)return;document.querySelector("#mini-player-frame").append(iframe);miniVideo=currentVideo;document.querySelector("#mini-title").textContent=currentVideo.title;document.querySelector("#mini-player").hidden=false;navigate("#home")}
function comments(videoId){const savedComments=saved.comments||{},items=savedComments[videoId]||[];document.querySelector("#comments-heading").textContent=`${items.length} comments · saved on this device`;const box=document.querySelector("#comments-list");box.replaceChildren(...items.map(text=>{const p=document.createElement("p");p.className="comment-item";p.textContent=text;return p}))}

// Navigation and search
window.addEventListener("hashchange",route);
searchForm.addEventListener("submit",e=>{e.preventDefault();startSearch(searchInput.value)});
searchInput.addEventListener("input",()=>{if(routeName==="home")renderFeed()});
loadMore.addEventListener("click",()=>{if(loading)return;if(pending.length){apiVideos=apiVideos.concat(pending.splice(0,showCount));renderFeed()}else if(pageToken)loadSearch(false)});
homeMore.addEventListener("click",()=>{if(homeFailed)homeFailed=false;loadHomeMore(!homeInitialized)});
if("IntersectionObserver" in window){homeObserver=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)&&["home","category"].includes(routeName)&&!searchInput.value.trim()&&!homeFailed)loadHomeMore(!homeInitialized)},{rootMargin:"700px 0px"});homeObserver.observe(homeSentinel)}
categoryButtons.forEach(b=>b.addEventListener("click",()=>{activeCategory=b.dataset.category;categoryButtons.forEach(x=>x.classList.toggle("active",x===b));if(routeName==="search")startSearch(lastQuery,false);else navigate(`#category/${encodeURIComponent(activeCategory)}`)}));
document.querySelectorAll(".side-link[data-route]").forEach(a=>a.addEventListener("click",e=>{e.preventDefault();navigate(`#${a.dataset.route}`);if(innerWidth<=720)document.querySelector(".sidebar").classList.remove("mobile-open")}));
document.querySelector("#sidebar-toggle").addEventListener("click",()=>{const side=document.querySelector(".sidebar");if(innerWidth<=720)side.classList.toggle("mobile-open");else document.body.classList.toggle("sidebar-collapsed")});

// Cards, overflow menus, channel links, and video actions
document.addEventListener("click",e=>{
 const act=e.target.closest("[data-action]");if(act){e.preventDefault();e.stopPropagation();const v=allVideos().find(x=>x.id===act.dataset.id);if(v)action(act.dataset.action,v);return}
 const more=e.target.closest("[data-menu-for]");if(more){e.stopPropagation();const menu=more.parentElement.querySelector(".video-menu");document.querySelectorAll(".video-menu").forEach(x=>{if(x!==menu)x.hidden=true});menu.hidden=!menu.hidden;return}
 const channel=e.target.closest("[data-channel-for]");if(channel){e.preventDefault();e.stopPropagation();openChannel(channel.dataset.channelFor);return}
 const open=e.target.closest("[data-open-video]");if(open){openWatch(open.dataset.openVideo);return}
 const short=e.target.closest(".short-card");if(short){openWatch(short.dataset.shortVideoId);return}
 const subscribe=e.target.closest("[data-subscribe]");if(subscribe){const v=allVideos().find(x=>x.id===subscribe.dataset.subscribe)||currentChannel;if(!v)return;const key=v.channelId||v.channel,subs=list("subscriptions"),i=subs.findIndex(x=>x.id===key);if(i>=0)subs.splice(i,1);else subs.push({id:key,channel:v.channel,channelId:v.channelId||"",channelAvatar:v.channelAvatar||""});saveState();route();toast(i>=0?"Unsubscribed":"Subscribed");return}
 const watchAction=e.target.closest("[data-watch]");if(watchAction&&currentVideo){const k=watchAction.dataset.watch;if(k==="mini"){minimize();return}if(k==="share"){action("share",currentVideo);return}const key=k==="like"?"liked":"watchLater",add=!isSaved(key,currentVideo.id),items=list(key),i=items.findIndex(x=>x.id===currentVideo.id);if(add)items.unshift(snapshot(currentVideo));else if(i>=0)items.splice(i,1);saveState();renderWatch(currentVideo);toast(add?"Saved":"Removed");return}
 if(e.target.id==="description-toggle"){const p=document.querySelector("#description-text");p.classList.toggle("expanded");e.target.textContent=p.classList.contains("expanded")?"Show less":"Show more"}
});

// Channel, library, watch, and subscriptions views
["#up-next-list","#channel-grid","#library-grid","#subscriptions-grid","#playlists-view"].forEach(selector=>document.querySelector(selector).addEventListener("click",e=>{const b=e.target.closest("[data-open-video]");if(b)openWatch(b.dataset.openVideo)}));
document.querySelector(".channel-tabs").addEventListener("click",e=>{const button=e.target.closest(".channel-tab");if(!button)return;document.querySelectorAll(".channel-tab").forEach(item=>item.classList.toggle("selected",item===button));const tab=button.textContent;let items=channelFeed;if(tab==="Shorts")items=channelFeed.filter(v=>{const parts=(v.duration||"").split(":").map(Number);return parts.length===2&&parts[0]===0&&parts[1]<60});if(["Live","Playlists"].includes(tab))items=[];const container=document.querySelector("#channel-grid");if(items.length)cards(container,items);else container.innerHTML=`<p class="empty-state">No ${tab.toLowerCase()} are available in this channel's videos on your current feed.</p>`});document.querySelector("#comment-form").addEventListener("submit",e=>{e.preventDefault();const input=document.querySelector("#comment-input"),text=input.value.trim();if(!text||!currentVideo)return;saved.comments||={};saved.comments[currentVideo.id]||=[];saved.comments[currentVideo.id].unshift(text);saveState();input.value="";comments(currentVideo.id)});
document.querySelector("#clear-library").addEventListener("click",()=>{saved.history=[];saveState();renderLibrary("history");toast("History cleared")});
document.querySelector("#new-playlist-form").addEventListener("submit",e=>{e.preventDefault();const input=document.querySelector("#playlist-name"),name=input.value.trim();if(!name)return;saved.playlists||={};saved.playlists[name]||=[];if(pendingPlaylist)saved.playlists[name].unshift(snapshot(pendingPlaylist));saveState();input.value="";pendingPlaylist=null;document.querySelector("#playlist-dialog").close();toast(`Playlist “${name}” created`)});
document.querySelector("#playlist-dialog").addEventListener("close",()=>{pendingPlaylist=null});

// Top bar controls, theme, upload link, and optional voice search
document.querySelector("#create-open").addEventListener("click",()=>document.querySelector("#create-dialog").showModal());
document.querySelector("#notifications-open").addEventListener("click",()=>{const p=document.querySelector("#notifications-menu");p.hidden=!p.hidden;document.querySelector("#profile-menu").hidden=true});
document.querySelector("#profile-open").addEventListener("click",()=>{const p=document.querySelector("#profile-menu");p.hidden=!p.hidden;document.querySelector("#notifications-menu").hidden=true});
document.querySelector("#theme-toggle").addEventListener("click",()=>{const light=document.body.classList.toggle("light-theme");localStorage.setItem("quviyo-theme",light?"light":"dark");document.querySelector("#theme-toggle span").textContent=light?"Switch to dark theme":"Switch to light theme"});
document.querySelector("#settings-open").addEventListener("click",()=>{document.querySelector("#profile-menu").hidden=false});
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>document.querySelector(`#${b.dataset.close}`).close()));
document.querySelector("#restore-player").addEventListener("click",()=>{if(miniVideo)navigate(`#watch/${encodeURIComponent(miniVideo.id)}`)});
document.querySelector("#close-mini-player").addEventListener("click",stopMini);
document.querySelector("#voice-search").addEventListener("click",()=>{const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){toast("Voice search is not available in this browser.");return}const rec=new SR();rec.lang=navigator.language||"en-US";rec.onresult=e=>{searchInput.value=e.results[0][0].transcript;startSearch(searchInput.value)};rec.onerror=()=>toast("Voice search stopped. Try typing instead.");rec.start();toast("Listening…")});
document.addEventListener("click",e=>{if(!e.target.closest(".video-menu")&&!e.target.closest("[data-menu-for]"))document.querySelectorAll(".video-menu").forEach(x=>x.hidden=true);if(!e.target.closest(".popover-wrap")){document.querySelector("#profile-menu").hidden=true;document.querySelector("#notifications-menu").hidden=true}});
window.addEventListener("keydown",e=>{if(e.key==="Escape")document.querySelector(".sidebar").classList.remove("mobile-open")});

const savedTheme=localStorage.getItem("quviyo-theme");if(savedTheme==="light"){document.body.classList.add("light-theme");document.querySelector("#theme-toggle span").textContent="Switch to dark theme"}
route();loadHomeSuggestions();







