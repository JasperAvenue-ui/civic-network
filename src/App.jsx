import { useState, useEffect } from "react";
import { supabase } from "./supabase";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Source+Serif+4:opsz,wght@8..60,300;8..60,400;8..60,600&family=JetBrains+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#070f1c;--bg-card:#0d1b2e;--bg-hover:#122240;
  --border:#1a3355;--border-light:#243f60;
  --gold:#c8a84b;--cream:#e8dfc8;--cream-dim:#a89e8a;
  --blue:#4a9eff;--red:#e05252;--green:#4cae7f;--text-dim:#8e9ab0;
  --fdisplay:'Playfair Display',Georgia,serif;
  --fbody:'Source Serif 4',Georgia,serif;
  --fmono:'JetBrains Mono','Courier New',monospace;
  --sw:220px;--bnav:56px;
}
body{background:var(--bg);color:var(--cream);font-family:var(--fbody);font-size:14px}
.app{display:flex;min-height:100vh}
.sidebar{width:var(--sw);background:var(--bg-card);border-right:1px solid var(--border);display:flex;flex-direction:column;position:fixed;top:0;left:0;height:100vh;z-index:200;transition:transform .25s ease}
.sb-logo{padding:22px 20px 18px;border-bottom:1px solid var(--border)}
.sb-logo h1{font-family:var(--fdisplay);font-size:14px;font-weight:700;color:var(--gold);letter-spacing:.04em;line-height:1.3}
.sb-logo span{font-size:10px;color:var(--text-dim);letter-spacing:.1em;font-family:var(--fmono);display:block;margin-top:4px}
.sb-nav{flex:1;padding:10px 0;overflow-y:auto}
.nav-item{display:flex;align-items:center;gap:10px;padding:10px 20px;cursor:pointer;transition:all .15s;font-size:12px;color:var(--text-dim);letter-spacing:.02em;border-left:2px solid transparent;font-family:var(--fmono)}
.nav-item:hover{color:var(--cream);background:var(--bg-hover)}
.nav-item.active{color:var(--gold);border-left-color:var(--gold);background:rgba(200,168,75,.08)}
.sb-user{padding:14px 20px;border-top:1px solid var(--border);font-size:12px}
.sb-user-name{font-family:var(--fdisplay);font-size:14px;color:var(--cream)}
.sb-user-sub{color:var(--text-dim);font-family:var(--fmono);font-size:10px;margin-top:2px}
.sb-overlay{display:none;position:fixed;inset:0;background:rgba(7,15,28,.7);z-index:150}
.main{margin-left:var(--sw);flex:1;min-height:100vh;display:flex;flex-direction:column}
.topbar{padding:16px 28px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;background:var(--bg);position:sticky;top:0;z-index:100}
.topbar h2{font-family:var(--fdisplay);font-size:19px;font-weight:700}
.topbar-meta{font-family:var(--fmono);font-size:10px;color:var(--text-dim)}
.hamburger{display:none;background:none;border:none;color:var(--cream);cursor:pointer;padding:4px;font-size:22px;line-height:1}
.content{padding:28px 30px;max-width:1060px;width:100%}
.card{background:var(--bg-card);border:1px solid var(--border);border-radius:3px;padding:22px}
.ctitle{font-family:var(--fmono);font-size:11px;font-weight:500;color:var(--gold);text-transform:uppercase;letter-spacing:.08em;margin-bottom:14px}
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:28px}
.stat-card{background:var(--bg-card);border:1px solid var(--border);padding:18px;border-radius:3px}
.stat-val{font-family:var(--fdisplay);font-size:30px;font-weight:700;color:var(--gold)}
.stat-lbl{font-size:11px;color:var(--text-dim);margin-top:4px;font-family:var(--fmono);letter-spacing:.05em}
.stat-sub{font-size:10px;color:var(--green);margin-top:6px;font-family:var(--fmono)}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.prop-list{display:flex;flex-direction:column;gap:10px}
.prop-card{background:var(--bg-card);border:1px solid var(--border);border-radius:3px;padding:18px 22px;cursor:pointer;transition:all .15s;position:relative;overflow:hidden}
.prop-card:hover{border-color:var(--border-light);background:var(--bg-hover)}
.prop-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px}
.prop-card.s-voting::before{background:var(--blue)}
.prop-card.s-deliberation::before{background:var(--gold)}
.prop-card.s-passed::before{background:var(--green)}
.prop-card.s-failed::before{background:var(--red)}
.prop-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px}
.prop-title{font-family:var(--fdisplay);font-size:15px;font-weight:600;line-height:1.35}
.badge{font-family:var(--fmono);font-size:10px;padding:2px 7px;border-radius:2px;text-transform:uppercase;letter-spacing:.07em;white-space:nowrap;flex-shrink:0}
.b-pending{background:rgba(200,168,75,.15);color:var(--gold);border:1px solid rgba(200,168,75,.3)}
.b-shelved{background:rgba(142,154,176,.15);color:var(--text-dim);border:1px solid rgba(142,154,176,.3)}
.notif-badge{position:absolute;top:-4px;right:-4px;width:16px;height:16px;background:var(--red);border-radius:50%;font-size:9px;font-family:var(--fmono);color:#fff;display:flex;align-items:center;justify-content:center}
.mod-card{background:var(--bg-card);border:1px solid var(--border);border-left:3px solid var(--gold);border-radius:3px;padding:16px 20px;margin-bottom:10px;cursor:pointer;transition:all .15s}
.mod-card:hover{background:var(--bg-hover)}
.version-item{padding:12px;background:rgba(0,0,0,.2);border-radius:3px;border-left:2px solid var(--border);margin-bottom:8px;font-size:12px}
.version-num{font-family:var(--fmono);font-size:10px;color:var(--gold);margin-bottom:4px}
.flag-card{background:var(--bg-card);border:1px solid var(--border);border-radius:3px;padding:18px;margin-bottom:10px}
.flag-card.urgent{border-left:3px solid var(--red)}
.b-deliberation{background:rgba(200,168,75,.15);color:var(--gold);border:1px solid rgba(200,168,75,.3)}
.b-passed{background:rgba(76,174,127,.15);color:var(--green);border:1px solid rgba(76,174,127,.3)}
.b-failed{background:rgba(224,82,82,.15);color:var(--red);border:1px solid rgba(224,82,82,.3)}
.prop-meta{display:flex;gap:14px;margin-top:8px;font-family:var(--fmono);font-size:10px;color:var(--text-dim);flex-wrap:wrap}
.prop-sum{margin-top:8px;font-size:13px;color:var(--cream-dim);line-height:1.65}
.vbar-wrap{margin-top:12px}
.vbar{height:4px;background:var(--border);border-radius:2px;overflow:hidden}
.vbar-fill{height:100%;background:linear-gradient(90deg,var(--green),var(--blue));transition:width .3s}
.vstats{display:flex;justify-content:space-between;margin-top:5px;font-family:var(--fmono);font-size:10px}
.lvl-tabs{display:flex;gap:0;margin-bottom:22px;border:1px solid var(--border);border-radius:3px;overflow:hidden}
.lvl-tab{flex:1;padding:9px;text-align:center;cursor:pointer;font-family:var(--fmono);font-size:11px;letter-spacing:.05em;color:var(--text-dim);border-right:1px solid var(--border);background:var(--bg-card);transition:all .15s}
.lvl-tab:last-child{border-right:none}
.lvl-tab.active{background:rgba(200,168,75,.12);color:var(--gold)}
.lvl-tab:hover:not(.active){background:var(--bg-hover);color:var(--cream)}
.crit-sec{margin-bottom:22px;padding:14px 18px;background:rgba(200,168,75,.05);border:1px solid rgba(200,168,75,.2);border-radius:3px}
.crit-lbl{font-family:var(--fmono);font-size:10px;color:var(--gold);letter-spacing:.07em;margin-bottom:10px}
.crit-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:6px}
.crit-item{display:flex;justify-content:space-between;align-items:center;font-size:11px;padding:5px 9px;background:rgba(0,0,0,.3);border-radius:2px}
.crit-name{color:var(--cream-dim)}
.crit-pct{font-family:var(--fmono);color:var(--gold);font-size:10px}
.alloc-row{margin-bottom:14px}
.alloc-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
.alloc-name{font-size:13px;color:var(--cream);display:flex;align-items:center;gap:7px}
.alloc-pct{font-family:var(--fmono);font-size:11px;color:var(--gold)}
input[type=range]{-webkit-appearance:none;width:100%;height:5px;border-radius:3px;background:var(--border);outline:none;cursor:pointer}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:15px;height:15px;border-radius:50%;background:var(--gold);cursor:pointer;border:2px solid var(--bg)}
.rem-bar{display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--bg-card);border:1px solid var(--border);border-radius:3px;margin-bottom:22px;font-family:var(--fmono);font-size:11px;flex-wrap:wrap}
.rem-val{color:var(--gold);font-size:15px;font-weight:500;min-width:36px}
.rem-track{flex:1;min-width:80px;height:5px;background:var(--border);border-radius:3px;overflow:hidden}
.rem-fill{height:100%;background:var(--gold);transition:width .2s}
.save-btn{padding:11px 28px;background:var(--gold);color:#070f1c;border:none;cursor:pointer;font-family:var(--fmono);font-size:12px;font-weight:500;border-radius:2px;letter-spacing:.05em;transition:all .15s}
.save-btn:hover{background:#d4b55a}
.ledger-tbl{width:100%;border-collapse:collapse;font-family:var(--fmono);font-size:11px}
.ledger-tbl th{text-align:left;padding:9px 10px;color:var(--gold);border-bottom:1px solid var(--border);letter-spacing:.06em;font-size:10px}
.ledger-tbl td{padding:9px 10px;border-bottom:1px solid rgba(26,51,85,.4);color:var(--cream-dim);vertical-align:top}
.ledger-tbl tr:hover td{background:var(--bg-hover)}
.ltype{padding:2px 6px;border-radius:2px;font-size:9px;letter-spacing:.07em}
.lt-VOTE{background:rgba(74,158,255,.15);color:var(--blue)}
.lt-ALLOCATION{background:rgba(200,168,75,.15);color:var(--gold)}
.lt-PROPOSAL{background:rgba(76,174,127,.15);color:var(--green)}
.lt-MODERATION{background:rgba(160,160,160,.15);color:#aaa}
.lt-PASSED{background:rgba(76,174,127,.2);color:var(--green)}
.back-btn{display:flex;align-items:center;gap:5px;font-family:var(--fmono);font-size:11px;color:var(--text-dim);cursor:pointer;margin-bottom:22px;padding:5px 0;background:none;border:none;transition:color .15s}
.back-btn:hover{color:var(--cream)}
.det-title{font-family:var(--fdisplay);font-size:26px;font-weight:700;line-height:1.3;margin-bottom:11px}
.dtabs{display:flex;gap:0;border-bottom:1px solid var(--border);margin-bottom:22px;overflow-x:auto}
.dtab{padding:9px 18px;font-family:var(--fmono);font-size:11px;cursor:pointer;color:var(--text-dim);border-bottom:2px solid transparent;transition:all .15s;margin-bottom:-1px;white-space:nowrap}
.dtab.active{color:var(--gold);border-bottom-color:var(--gold)}
.dtab:hover:not(.active){color:var(--cream)}
.qblock{margin-bottom:22px}
.qnum{font-family:var(--fmono);font-size:10px;color:var(--gold);margin-bottom:6px}
.qtext{font-size:14px;color:var(--cream);margin-bottom:10px;line-height:1.55}
.opts{display:flex;flex-direction:column;gap:7px}
.opt-btn{padding:9px 14px;background:var(--bg-card);border:1px solid var(--border);color:var(--cream-dim);cursor:pointer;text-align:left;font-family:var(--fbody);font-size:13px;border-radius:2px;transition:all .15s;width:100%}
.opt-btn:hover{border-color:var(--border-light);color:var(--cream)}
.opt-btn.sel{border-color:var(--blue);color:var(--blue);background:rgba(74,158,255,.08)}
.opt-btn.corr{border-color:var(--green);color:var(--green);background:rgba(76,174,127,.1)}
.opt-btn.incorr{border-color:var(--red);color:var(--red);background:rgba(224,82,82,.1)}
.vote-acts{display:flex;gap:14px;margin-top:22px}
.vote-btn{flex:1;padding:15px;border:2px solid;cursor:pointer;font-family:var(--fmono);font-size:12px;letter-spacing:.05em;border-radius:2px;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:7px;background:transparent}
.vote-btn:disabled{opacity:.4;cursor:default}
.vbf{border-color:var(--green);color:var(--green)}
.vbf:hover:not(:disabled),.vbf.vactive{background:rgba(76,174,127,.15)}
.vba{border-color:var(--red);color:var(--red)}
.vba:hover:not(:disabled),.vba.vactive{background:rgba(224,82,82,.15)}
.notif{position:fixed;bottom:72px;right:22px;background:var(--bg-card);border:1px solid var(--green);color:var(--green);padding:10px 18px;font-family:var(--fmono);font-size:11px;border-radius:3px;z-index:1000;animation:slideIn .2s ease}
@keyframes slideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.modal-ov{position:fixed;inset:0;background:rgba(7,15,28,.88);z-index:300;display:flex;align-items:center;justify-content:center;padding:22px}
.modal{background:var(--bg-card);border:1px solid var(--border-light);border-radius:3px;padding:28px;max-width:540px;width:100%;max-height:90vh;overflow-y:auto}
.modal-title{font-family:var(--fdisplay);font-size:18px;font-weight:700;margin-bottom:6px}
.modal-sub{font-size:12px;color:var(--text-dim);margin-bottom:22px;line-height:1.6}
.fgrp{margin-bottom:18px}
.flbl{font-family:var(--fmono);font-size:10px;color:var(--gold);letter-spacing:.06em;display:block;margin-bottom:7px}
.finput{width:100%;background:var(--bg);border:1px solid var(--border);color:var(--cream);padding:9px 12px;font-family:var(--fbody);font-size:13px;border-radius:2px;outline:none;transition:border-color .15s}
.finput:focus{border-color:var(--gold)}
.ftarea{resize:vertical;min-height:90px}
.fsel{appearance:none;cursor:pointer}
.modal-acts{display:flex;gap:10px;margin-top:22px;justify-content:flex-end}
.btn-p{padding:9px 22px;background:var(--gold);color:#070f1c;border:none;cursor:pointer;font-family:var(--fmono);font-size:11px;font-weight:500;border-radius:2px;letter-spacing:.05em}
.btn-p:disabled{opacity:.45;cursor:default}
.btn-g{padding:9px 22px;background:transparent;color:var(--text-dim);border:1px solid var(--border);cursor:pointer;font-family:var(--fmono);font-size:11px;border-radius:2px}
.btn-g:hover{color:var(--cream);border-color:var(--border-light)}
.score-disp{text-align:center;padding:28px}
.score-num{font-family:var(--fdisplay);font-size:60px;font-weight:900}
.score-pass{color:var(--green)}
.score-fail{color:var(--red)}
.score-lbl{font-family:var(--fmono);font-size:13px;margin-top:7px}
.sec-bar-row{display:flex;align-items:center;gap:10px;margin-bottom:9px}
.sec-bar-name{width:130px;font-size:11px;color:var(--cream-dim);text-align:right;flex-shrink:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.sec-bar-track{flex:1;height:7px;background:var(--border);border-radius:4px;overflow:hidden}
.sec-bar-fill{height:100%;border-radius:4px;transition:width .3s}
.sec-bar-pct{width:32px;font-family:var(--fmono);font-size:10px;color:var(--gold);flex-shrink:0}
.act-item{display:flex;gap:10px;padding:10px 0;border-bottom:1px solid rgba(26,51,85,.4);font-size:12px;align-items:flex-start}
.act-ico{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0;margin-top:1px}
.act-ico-vote{background:rgba(74,158,255,.2)}
.act-ico-prop{background:rgba(76,174,127,.2)}
.act-ico-alloc{background:rgba(200,168,75,.2)}
.act-target{color:var(--cream);line-height:1.4}
.act-date{font-family:var(--fmono);font-size:10px;color:var(--text-dim);margin-top:2px}
.part-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.part-card{background:rgba(0,0,0,.3);border:1px solid var(--border);padding:13px;border-radius:3px}
.part-lvl{font-family:var(--fmono);font-size:10px;color:var(--gold);letter-spacing:.08em;margin-bottom:9px}
.part-row{display:flex;justify-content:space-between;align-items:center;padding:3px 0;font-size:11px;border-bottom:1px solid rgba(26,51,85,.4)}
.part-row:last-child{border-bottom:none}
.part-nm{color:var(--cream-dim);overflow:hidden;white-space:nowrap;text-overflow:ellipsis;max-width:110px}
.part-pts{font-family:var(--fmono);font-size:10px;color:var(--blue)}
.quorum-ring{position:relative;width:76px;height:76px;flex-shrink:0}
.quorum-ring svg{transform:rotate(-90deg)}
.qring-lbl{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:var(--fdisplay);font-size:15px;font-weight:700}
.qmeta{font-size:12px;color:var(--text-dim);font-family:var(--fmono);line-height:1.8}
.qmeta span{color:var(--cream);display:block;font-size:13px;margin-bottom:2px}
.profile-av{width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,var(--gold),#6b4c15);display:flex;align-items:center;justify-content:center;font-family:var(--fdisplay);font-size:22px;font-weight:700;color:#070f1c;flex-shrink:0}
.profile-name{font-family:var(--fdisplay);font-size:22px;font-weight:700}
.profile-user{font-family:var(--fmono);font-size:11px;color:var(--gold);margin-top:3px}
.profile-bio{font-size:12px;color:var(--text-dim);margin-top:6px}
.info-box{background:rgba(200,168,75,.06);border:1px solid rgba(200,168,75,.2);border-radius:3px;padding:14px 18px;font-size:13px;color:var(--cream-dim);line-height:1.7;margin-bottom:22px}
.about-tabs{display:flex;gap:0;border:1px solid var(--border);border-radius:3px;overflow:hidden;margin-bottom:24px}
.about-tab{flex:1;padding:12px 10px;text-align:center;cursor:pointer;font-family:var(--fmono);font-size:11px;letter-spacing:.04em;color:var(--text-dim);border-right:1px solid var(--border);background:var(--bg-card);transition:all .15s}
.about-tab:last-child{border-right:none}
.about-tab.active{background:rgba(200,168,75,.12);color:var(--gold)}
.about-tab:hover:not(.active){background:var(--bg-hover);color:var(--cream)}
.about-hero{padding:28px 0 22px;border-bottom:1px solid var(--border);margin-bottom:28px}
.about-tag{font-family:var(--fmono);font-size:10px;color:var(--gold);letter-spacing:.1em;margin-bottom:10px}
.about-title{font-family:var(--fdisplay);font-size:32px;font-weight:700;line-height:1.25;margin-bottom:14px}
.about-sub{font-size:15px;color:var(--cream-dim);line-height:1.75;max-width:700px}
.about-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:24px}
.about-card{background:var(--bg-card);border:1px solid var(--border);border-radius:3px;padding:18px}
.about-card-icon{font-size:22px;margin-bottom:10px}
.about-card-title{font-family:var(--fdisplay);font-size:14px;font-weight:600;color:var(--cream);margin-bottom:6px}
.about-card-text{font-size:12px;color:var(--cream-dim);line-height:1.65}
.about-sec{margin-bottom:28px}
.about-sec-title{font-family:var(--fdisplay);font-size:18px;font-weight:700;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid var(--border)}
.about-p{font-size:13px;color:var(--cream-dim);line-height:1.8;margin-bottom:12px}
.about-ep{background:var(--bg-card);border:1px solid var(--border);border-radius:3px;padding:16px 18px;margin-bottom:10px}
.about-ep-num{font-family:var(--fmono);font-size:10px;color:var(--gold);margin-bottom:4px}
.about-ep-title{font-family:var(--fdisplay);font-size:14px;font-weight:600;margin-bottom:6px}
.about-ep-text{font-size:12px;color:var(--cream-dim);line-height:1.6}
.svc-item{display:flex;gap:12px;padding:14px 0;border-bottom:1px solid rgba(26,51,85,.4);align-items:flex-start}
.svc-item:last-child{border-bottom:none}
.svc-icon{font-size:20px;flex-shrink:0;width:32px;text-align:center}
.svc-name{font-family:var(--fdisplay);font-size:13px;font-weight:600;margin-bottom:4px}
.svc-text{font-size:12px;color:var(--cream-dim);line-height:1.6}
.phase-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:16px}
.phase-card{background:var(--bg-card);border:1px solid var(--border);border-radius:3px;padding:16px}
.phase-num{font-family:var(--fmono);font-size:10px;color:var(--gold);margin-bottom:6px}
.phase-title{font-family:var(--fdisplay);font-size:13px;font-weight:600;margin-bottom:4px}
.phase-dur{font-family:var(--fmono);font-size:10px;color:var(--blue);margin-bottom:6px}
.phase-text{font-size:11px;color:var(--cream-dim);line-height:1.6}
.reply-btn{background:none;border:none;font-family:var(--fmono);font-size:10px;color:var(--text-dim);cursor:pointer;padding:4px 0;transition:color .15s}
.reply-btn:hover{color:var(--blue)}
.comment-box{padding:12px 14px;background:rgba(0,0,0,.2);border-radius:3px;border-left:2px solid var(--border)}
.comment-box:hover{border-left-color:var(--border-light)}
.comment-header{font-family:var(--fmono);font-size:10px;color:var(--text-dim);margin-bottom:6px;display:flex;gap:12px;align-items:center}
.comment-text{font-size:13px;color:var(--cream-dim);line-height:1.7;margin-bottom:6px}
.comment-children{margin-left:16px;margin-top:8px;padding-left:12px;border-left:1px solid var(--border)}
.sector-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px}
.sector-card{background:var(--bg-card);border:1px solid var(--border);border-radius:3px;padding:18px;cursor:pointer;transition:all .15s;position:relative;overflow:hidden}
.sector-card:hover{border-color:var(--border-light);background:var(--bg-hover)}
.sector-card.has-alloc{border-color:rgba(200,168,75,.3);background:rgba(200,168,75,.04)}
.sector-card.has-alloc:hover{border-color:var(--gold);background:rgba(200,168,75,.08)}
.sector-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px}
.sector-card-name{font-family:var(--fdisplay);font-size:14px;font-weight:600;margin-bottom:6px;margin-top:8px}
.sector-card-meta{font-family:var(--fmono);font-size:10px;color:var(--text-dim);display:flex;gap:10px;flex-wrap:wrap}
.sector-card-alloc{font-family:var(--fmono);font-size:11px;color:var(--gold);margin-top:8px}
.sector-level-title{font-family:var(--fdisplay);font-size:16px;font-weight:700;margin-bottom:14px;padding-bottom:8px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px}
.past-toggle{display:flex;align-items:center;gap:8px;padding:12px 16px;background:var(--bg-card);border:1px solid var(--border);border-radius:3px;cursor:pointer;font-family:var(--fmono);font-size:11px;color:var(--text-dim);margin-top:22px;transition:all .15s}
.past-toggle:hover{color:var(--cream);border-color:var(--border-light)}
@media(max-width:768px){.sector-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:420px){.sector-grid{grid-template-columns:1fr}}
.bottom-nav{display:none;position:fixed;bottom:0;left:0;right:0;background:var(--bg-card);border-top:1px solid var(--border);z-index:200;height:var(--bnav)}
.bnav-items{display:flex;height:100%}
.bnav-item{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;color:var(--text-dim);font-family:var(--fmono);font-size:9px;gap:3px;transition:color .15s;border:none;background:none;padding:0}
.bnav-item.active{color:var(--gold)}
.bnav-icon{font-size:17px;line-height:1}
@media(max-width:768px){
  .sidebar{transform:translateX(-100%)}
  .sidebar.open{transform:translateX(0)}
  .sb-overlay{display:block}
  .main{margin-left:0;padding-bottom:var(--bnav)}
  .hamburger{display:block}
  .topbar-meta{display:none}
  .topbar{padding:12px 16px}
  .content{padding:16px}
  .stats-grid{grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:16px}
  .two-col{grid-template-columns:1fr}
  .part-grid{grid-template-columns:1fr}
  .about-grid{grid-template-columns:1fr}
  .phase-grid{grid-template-columns:1fr}
  .crit-grid{grid-template-columns:1fr}
  .bottom-nav{display:flex}
  .det-title{font-size:20px}
  .vote-acts{flex-direction:column}
  .about-title{font-size:22px}
  .notif{bottom:66px;right:12px;left:12px}
}
@media(max-width:420px){
  .stat-val{font-size:24px}
  .about-tabs{font-size:10px}
}
`;

const SECTORS={
  federal:{
    critical:[{id:"fc_def",name:"National Defence",pct:7.5},{id:"fc_cyber",name:"Cybersecurity",pct:5},{id:"fc_border",name:"Border Systems",pct:7.5},{id:"fc_civic",name:"Civic Infrastructure",pct:10}],
    flexible:[{id:"ff_health",name:"Healthcare Transfers",color:"#e05252"},{id:"ff_edu",name:"Education Transfers",color:"#4a9eff"},{id:"ff_infra",name:"Infrastructure",color:"#e67e22"},{id:"ff_climate",name:"Climate & Environment",color:"#4cae7f"},{id:"ff_indg",name:"Indigenous Affairs",color:"#9b59b6"},{id:"ff_digital",name:"Digital Innovation",color:"#16a085"},{id:"ff_foreign",name:"Foreign Affairs",color:"#c0392b"}],
  },
  provincial:{
    critical:[{id:"pc_hosp",name:"Hospitals & Emergency",pct:10},{id:"pc_grid",name:"Power Grid & Utilities",pct:10},{id:"pc_just",name:"Justice & Courts",pct:10}],
    flexible:[{id:"pf_k12",name:"K–12 Education",color:"#f39c12"},{id:"pf_post",name:"Post-Secondary",color:"#8e44ad"},{id:"pf_roads",name:"Roads & Transit",color:"#2ecc71"},{id:"pf_soc",name:"Social Services",color:"#e74c3c"},{id:"pf_hous",name:"Housing",color:"#1abc9c"},{id:"pf_env",name:"Environment",color:"#27ae60"}],
  },
  municipal:{
    critical:[{id:"mc_water",name:"Water & Waste",pct:10},{id:"mc_fire",name:"Fire & Emergency",pct:10},{id:"mc_trans",name:"Public Transit",pct:10}],
    flexible:[{id:"mf_roads",name:"Local Roads",color:"#95a5a6"},{id:"mf_parks",name:"Parks & Recreation",color:"#2ecc71"},{id:"mf_libs",name:"Libraries & Education",color:"#3498db"},{id:"mf_comm",name:"Community Programs",color:"#e67e22"},{id:"mf_plan",name:"Planning & Zoning",color:"#9b59b6"},{id:"mf_bylaw",name:"Bylaw & Safety",color:"#e74c3c"}],
  },
};

const INIT_ALLOC={
  federal:{ff_health:25,ff_edu:20,ff_climate:15,ff_infra:10,ff_indg:0,ff_digital:0,ff_foreign:0},
  provincial:{pf_k12:20,pf_post:15,pf_roads:15,pf_soc:10,pf_hous:10,pf_env:0},
  municipal:{mf_roads:15,mf_parks:20,mf_libs:15,mf_comm:10,mf_plan:10,mf_bylaw:0},
};

const INIT_PROPOSALS=[];
const INIT_LEDGER=[];

export default function DDTAP({ session, onLogout }){
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (session?.user) {
      supabase.from("users").select("*").eq("id", session.user.id).single()
        .then(({ data }) => { if (data) setUserProfile(data); });

      supabase.from("allocations").select("*").eq("user_id", session.user.id).eq("tax_year", 2026)
        .then(({ data }) => {
          if (data && data.length > 0) {
            const loaded = {
              federal:   { ...INIT_ALLOC.federal },
              provincial:{ ...INIT_ALLOC.provincial },
              municipal: { ...INIT_ALLOC.municipal },
            };
            data.forEach(row => {
              if (loaded[row.level]?.[row.sector_id] !== undefined) {
                loaded[row.level][row.sector_id] = row.percentage;
              }
            });
            setAlloc(loaded);
            setSavedAlloc(loaded);
          }
        });
    }
  }, [session]);

  const USER = userProfile ? {
    name: userProfile.full_name || userProfile.username,
    username: userProfile.username,
    taxPaid: userProfile.tax_paid,
    province: userProfile.province,
    municipality: userProfile.municipality,
    role: userProfile.role || 'citizen',
  } : { name:"...", username:"...", taxPaid:0, province:"", municipality:"", role:"citizen" };

  const[view,setView]=useState("dashboard");
  const[govLevel,setGovLevel]=useState("federal");
  const[alloc,setAlloc]=useState(INIT_ALLOC);
  const[savedAlloc,setSavedAlloc]=useState(INIT_ALLOC);
  const[proposals,setProposals]=useState(INIT_PROPOSALS);
  const[selectedId,setSelectedId]=useState(null);
  const[dtab,setDtab]=useState("overview");
  const[testAns,setTestAns]=useState({});
  const[testDone,setTestDone]=useState(false);
  const[testScore,setTestScore]=useState(null);
  const[notif,setNotif]=useState(null);
  const[showCreate,setShowCreate]=useState(false);
  const[createStep,setCreateStep]=useState(1);
  const[newProp,setNewProp]=useState({title:"",sectorId:"ff_health",summary:""});
  const[quizQs,setQuizQs]=useState(Array.from({length:10},(_,i)=>({id:i,q:"",opts:["","","",""],a:0})));
  const[discussions,setDiscussions]=useState({});
  const[commentDraft,setCommentDraft]=useState("");
  const[replyingTo,setReplyingTo]=useState(null);
  const[replyDraft,setReplyDraft]=useState("");
  const[highlightedComment,setHighlightedComment]=useState(null);
  const[myReps,setMyReps]=useState([]); // sectors where I have assigned a rep
  const[repFor,setRepFor]=useState([]); // citizens I am repping
  const[repTestPassed,setRepTestPassed]=useState({}); // {proposalId: true} - tests passed as rep
  const[showAssignRep,setShowAssignRep]=useState(false);
  const[assignRepSector,setAssignRepSector]=useState(null);
  const[assignRepUsername,setAssignRepUsername]=useState("");
  const[nextAlloc,setNextAlloc]=useState(INIT_ALLOC);
  const[taxYearMode,setTaxYearMode]=useState("current");

  const updateQ=(i,field,val)=>setQuizQs(prev=>prev.map((q,idx)=>idx===i?{...q,[field]:val}:q));
  const updateOpt=(qi,oi,val)=>setQuizQs(prev=>prev.map((q,idx)=>idx===qi?{...q,opts:q.opts.map((o,j)=>j===oi?val:o)}:q));
  const quizValid=quizQs.every(q=>q.q.trim()&&q.opts.every(o=>o.trim()));
  const[ledger,setLedger]=useState(INIT_LEDGER);
  const[filterSec,setFilterSec]=useState("all");
  const[selectedSector,setSelectedSector]=useState(null);
  const[showPast,setShowPast]=useState(false);
  const[notifications,setNotifications]=useState([]);
  const[propVersions,setPropVersions]=useState({}); // {proposalId: [{version, title, summary, questions, edited_by_username, created_at}]}
  const[oversightFlags,setOversightFlags]=useState([]);
  const[showNotifications,setShowNotifications]=useState(false);
  const[aboutTab,setAboutTab]=useState("ddtap");
  const[modSelectedId,setModSelectedId]=useState(null);
  const[authorEditDraft,setAuthorEditDraft]=useState(null);
  const[showAuthorConfirm,setShowAuthorConfirm]=useState(false);
  const[modEditDraft,setModEditDraft]=useState(null);
  const[shelveReason,setShelveReason]=useState("");
  const[showShelveModal,setShowShelveModal]=useState(null);
  const[flagReason,setFlagReason]=useState("");
  const[showFlagModal,setShowFlagModal]=useState(null);
  const[oversightSelectedId,setOversightSelectedId]=useState(null);
  const[sidebarOpen,setSidebarOpen]=useState(false);
  const[viewingProfile,setViewingProfile]=useState(null);

  const notify=(msg)=>{setNotif(msg);setTimeout(()=>setNotif(null),3200);};

  const getUA=(sector,sectorId)=>{
    // Check flexible allocation first
    const flex=savedAlloc[sector]?.[sectorId]||0;
    if(flex>0)return flex;
    // Check critical infrastructure
    const crit=SECTORS[sector]?.critical.find(s=>s.id===sectorId);
    if(crit)return crit.pct;
    return 0;
  };
  const flexTotal=(lvl)=>Object.values(alloc[lvl]).reduce((a,b)=>a+b,0);
  const nextFlexTotal=(lvl)=>Object.values(nextAlloc[lvl]).reduce((a,b)=>a+b,0);

  const addComment=(proposalId,parentId=null)=>{
    const draft=parentId?replyDraft:commentDraft;
    if(!draft.trim())return;
    const comment={id:Date.now(),author:USER.username,text:draft.trim(),ts:new Date().toISOString().slice(0,16).replace("T"," "),parentId};
    setDiscussions(prev=>({...prev,[proposalId]:[...(prev[proposalId]||[]),comment]}));
    if(parentId){setReplyDraft("");setReplyingTo(null);}
    else setCommentDraft("");
    notify("Comment posted ✓");
  };

  const updateNextAlloc=(lvl,id,val)=>{
    const others={...nextAlloc[lvl]};delete others[id];
    const otherSum=Object.values(others).reduce((a,b)=>a+b,0);
    setNextAlloc(prev=>({...prev,[lvl]:{...prev[lvl],[id]:Math.min(Math.max(0,val),70-otherSum)}}));
  };

  const saveNextAlloc=()=>{
    const nid="L"+String(parseInt(ledger[0].id.slice(1))+1).padStart(4,"0");
    setLedger(prev=>[{id:nid,type:"ALLOCATION",actor:USER.username,action:"2027 allocation saved",target:"Federal · Provincial · Municipal",sector:"All Sectors",ts:new Date().toISOString().slice(0,16).replace("T"," "),pts:"—"},...prev]);
    notify("2027 allocation saved to civic ledger ✓");
  };

  const addNotification=(userId,type,message,proposalId=null)=>{
    supabase.from("notifications").insert({user_id:userId,type,message,proposal_id:proposalId});
    if(userId===session?.user?.id) setNotifications(prev=>[{id:Date.now(),type,message,proposal_id:proposalId,read:false,created_at:new Date().toISOString()},...prev]);
  };

  const saveProposalVersion=(proposal,editedByUsername)=>{
    const versions=propVersions[proposal.id]||[];
    const newVersion={version:versions.length+1,title:proposal.title,summary:proposal.summary,questions:proposal.questions,edited_by_username:editedByUsername,created_at:new Date().toISOString().slice(0,16).replace("T"," ")};
    setPropVersions(prev=>({...prev,[proposal.id]:[...(prev[proposal.id]||[]),newVersion]}));
  };

  const modApprove=(pid)=>{
    const p=proposals.find(x=>x.id===pid);
    if(!p)return;
    setProposals(prev=>prev.map(x=>x.id===pid?{...x,status:"voting"}:x));
    const nid="L"+String(parseInt(ledger[0].id.slice(1))+1).padStart(4,"0");
    setLedger(prev=>[{id:nid,type:"MODERATION",actor:USER.username,action:"Proposal approved",target:p.title,sector:`${p.sector} · ${p.sectorName}`,ts:new Date().toISOString().slice(0,16).replace("T"," "),pts:"—"},...prev]);
    notify(`"${p.title}" approved and is now live ✓`);
  };

  const modShelve=(pid,reason)=>{
    const p=proposals.find(x=>x.id===pid);
    if(!p)return;
    setProposals(prev=>prev.map(x=>x.id===pid?{...x,status:"shelved",shelveReason:reason}:x));
    const nid="L"+String(parseInt(ledger[0].id.slice(1))+1).padStart(4,"0");
    setLedger(prev=>[{id:nid,type:"MODERATION",actor:USER.username,action:"Proposal shelved",target:p.title,sector:`${p.sector} · ${p.sectorName}`,ts:new Date().toISOString().slice(0,16).replace("T"," "),pts:"—"},...prev]);
    notify(`"${p.title}" has been shelved`);
  };

  const modEditProposal=(pid,newTitle,newSummary,newQuestions)=>{
    const p=proposals.find(x=>x.id===pid);
    if(!p)return;
    saveProposalVersion(p,USER.username);
    setProposals(prev=>prev.map(x=>x.id===pid?{...x,title:newTitle,summary:newSummary,questions:newQuestions,pendingAuthorReview:true}:x));
    notify("Edits saved. Author has been notified to review.");
  };

  const authorApprove=(pid,draft)=>{
    const p=proposals.find(x=>x.id===pid);
    if(!p)return;
    saveProposalVersion({...p,...draft},USER.username);
    setProposals(prev=>prev.map(x=>x.id===pid?{...x,...draft,status:"voting",pendingAuthorReview:false,deadline:new Date(Date.now()+90*86400000).toISOString().slice(0,10)}:x));
    setAuthorEditDraft(null);
    setShowAuthorConfirm(false);
    const nid="L"+String(parseInt(ledger[0].id.slice(1))+1).padStart(4,"0");
    setLedger(prev=>[{id:nid,type:"PROPOSAL",actor:USER.username,action:"Author approved — proposal now live",target:p.title,sector:`${p.sector} · ${p.sectorName}`,ts:new Date().toISOString().slice(0,16).replace("T"," "),pts:"—"},...prev]);
    notify("Proposal approved and is now live ✓");
  };

  const flagToOversight=(pid,reason)=>{
    const p=proposals.find(x=>x.id===pid);
    if(!p)return;
    const flag={id:`f${Date.now()}`,proposal_id:pid,proposal_title:p.title,author_id:session.user.id,author_username:USER.username,reason,status:"pending",deadline:new Date(Date.now()+90*86400000).toISOString().slice(0,10),votes:[],created_at:new Date().toISOString().slice(0,16).replace("T"," ")};
    setOversightFlags(prev=>[flag,...prev]);
    notify("Flag submitted to Oversight Committee ✓");
  };

  const oversightVote=(flagId,decision,reasoning)=>{
    setOversightFlags(prev=>prev.map(f=>{
      if(f.id!==flagId)return f;
      const votes=[...(f.votes||[]),{voter:USER.username,decision,reasoning,ts:new Date().toISOString().slice(0,16).replace("T"," ")}];
      const status=votes.length>=1?"resolved":"pending";
      if(status==="resolved"){
        const reinstate=decision==="reinstate";
        if(reinstate) setProposals(pp=>pp.map(p=>p.id===f.proposal_id?{...p,status:"voting",shelveReason:null}:p));
        notify(`Oversight ruled: ${reinstate?"Proposal reinstated":"Shelving upheld"}`);
      }
      return{...f,votes,status,outcome:decision};
    }));
  };

  // Load reps from Supabase
  useEffect(()=>{
    if(!session?.user)return;
    supabase.from("representatives").select("*").eq("citizen_id",session.user.id)
      .then(({data})=>{ if(data) setMyReps(data); });
    supabase.from("representatives").select("*").eq("rep_id",session.user.id)
      .then(({data})=>{ if(data) setRepFor(data); });
  },[session]);

  const assignRep=async(sectorId,sectorName,level,repUsername)=>{
    if(repUsername===USER.username){notify("You cannot represent yourself");return;}
    const{data:repUser}=await supabase.from("users").select("id,username").eq("username",repUsername).single();
    if(!repUser){notify("User not found");return;}
    const row={citizen_id:session.user.id,rep_id:repUser.id,sector_id:sectorId,sector_name:sectorName,level};
    const{error}=await supabase.from("representatives").upsert(row,{onConflict:"citizen_id,sector_id"});
    if(error){notify("Error assigning rep");return;}
    setMyReps(prev=>[...prev.filter(r=>r.sector_id!==sectorId),{...row,rep_username:repUsername}]);
    setShowAssignRep(false);setAssignRepUsername("");
    notify(`@${repUsername} assigned as your rep for ${sectorName} ✓`);
  };

  const removeRep=async(sectorId,sectorName)=>{
    await supabase.from("representatives").delete().eq("citizen_id",session.user.id).eq("sector_id",sectorId);
    setMyReps(prev=>prev.filter(r=>r.sector_id!==sectorId));
    // Clear any votes cast by rep on active proposals in this sector
    setProposals(prev=>prev.map(p=>{
      if(p.sectorId!==sectorId||p.status!=="voting")return p;
      if(p.repVote){
        const wasFor=p.repVote==="for",wasAgainst=p.repVote==="against";
        return{...p,repVote:null,userVoted:null,
          forVotes:wasFor?p.forVotes-1:p.forVotes,
          againstVotes:wasAgainst?p.againstVotes-1:p.againstVotes};
      }
      return p;
    }));
    notify(`Representative removed for ${sectorName}. Their active votes have been cleared.`);
  };

  const castRepVote=(pid,side,citizenUsername)=>{
    setProposals(prev=>prev.map(p=>{
      if(p.id!==pid)return p;
      return{...p,repVote:side};
    }));
    notify(`Vote cast on behalf of @${citizenUsername} ✓`);
  };

  const updateAlloc=(lvl,id,val)=>{
    const others={...alloc[lvl]};delete others[id];
    const otherSum=Object.values(others).reduce((a,b)=>a+b,0);
    setAlloc(prev=>({...prev,[lvl]:{...prev[lvl],[id]:Math.min(Math.max(0,val),70-otherSum)}}));
  };

  const saveAlloc=()=>{
    setSavedAlloc(alloc);
    const nid="L"+String(parseInt(ledger[0].id.slice(1))+1).padStart(4,"0");
    setLedger(p=>[{id:nid,type:"ALLOCATION",actor:USER.username,action:"Annual allocation updated",target:"Federal · Provincial · Municipal",sector:"All Sectors",ts:new Date().toISOString().slice(0,16).replace("T"," "),pts:"—"},...p]);
    notify("Allocations saved to civic ledger ✓");
  };

  const castVote=(pid,side)=>{
    const p=proposals.find(x=>x.id===pid);
    if(!p)return;
    const toggling=p.userVoted===side;
    const nid="L"+String(parseInt(ledger[0].id.slice(1))+1).padStart(4,"0");
    const entry={id:nid,type:"VOTE",actor:USER.username,action:toggling?`Retracted vote on`:`Voted ${side.toUpperCase()}`,target:p.title,sector:`${p.sector.charAt(0).toUpperCase()+p.sector.slice(1)} · ${p.sectorName}`,ts:new Date().toISOString().slice(0,16).replace("T"," "),pts:`${getUA(p.sector,p.sectorId)}pts`};
    setProposals(prev=>prev.map(x=>{
      if(x.id!==pid)return x;
      const wasFor=x.userVoted==="for",wasAgainst=x.userVoted==="against";
      let fv=x.forVotes,av=x.againstVotes;
      if(!toggling){if(side==="for"){fv++;if(wasAgainst)av--;}else{av++;if(wasFor)fv--;}}
      else{if(side==="for")fv--;else av--;}
      return{...x,forVotes:fv,againstVotes:av,userVoted:toggling?null:side};
    }));
    setLedger(prev=>[entry,...prev]);
    notify(toggling?"Vote retracted":"Vote recorded on civic ledger ✓");
  };

  const submitTest=(p)=>{
    const score=p.questions.filter((q,i)=>testAns[i]===q.a).length;
    setTestScore(score);setTestDone(true);
    if(score>=5){setProposals(prev=>prev.map(x=>x.id===p.id?{...x,userPassedTest:true}:x));notify("Comprehension test passed — you may now vote");}
  };

  const createProposal=()=>{
    const all3=[...SECTORS.federal.critical,...SECTORS.federal.flexible,...SECTORS.provincial.critical,...SECTORS.provincial.flexible,...SECTORS.municipal.critical,...SECTORS.municipal.flexible];
    const sec=all3.find(s=>s.id===newProp.sectorId);
    const lvl=sec.id.startsWith("f")?"federal":sec.id.startsWith("p")?"provincial":"municipal";
    const questions=quizQs.map(q=>({q:q.q,opts:q.opts,a:q.a}));
    setProposals(prev=>[{id:`p${Date.now()}`,title:newProp.title,sector:lvl,sectorName:sec.name,sectorId:sec.id,status:"pending",author:USER.username,created:new Date().toISOString().slice(0,10),deadline:null,summary:newProp.summary,forVotes:0,againstVotes:0,totalEligible:0,quorumPct:0,userVoted:null,userPassedTest:false,questions,shelveReason:null,pendingAuthorReview:false,province:USER.province,municipality:USER.municipality},...prev]);
    setShowCreate(false);
    setNewProp({title:"",sectorId:"ff_health",summary:""});
    setQuizQs(Array.from({length:10},(_,i)=>({id:i,q:"",opts:["","","",""],a:0})));
    setCreateStep(1);
    notify("Proposal submitted to civic ledger ✓");
  };

  const navTo=(v)=>{setView(v);setSidebarOpen(false);if(v==="profile")setViewingProfile(null);};
  const openProp=(p)=>{setSelectedId(p.id);setView("proposal");setDtab("overview");setTestAns({});setTestDone(false);setTestScore(null);setSidebarOpen(false);};
  const getSel=()=>proposals.find(x=>x.id===selectedId);

  const UserLink=({username})=>(
    <span style={{color:"var(--blue)",cursor:"pointer",textDecoration:"underline"}} onClick={e=>{e.stopPropagation();setViewingProfile(username);setView("profile");}}>
      {username}
    </span>
  );

  const Badge=({status})=>{
    const m={voting:["VOTING","b-voting"],deliberation:["DELIBERATION","b-deliberation"],passed:["PASSED","b-passed"],failed:["FAILED","b-failed"],pending:["PENDING MOD REVIEW","b-pending"],shelved:["SHELVED","b-shelved"]};
    const[l,c]=m[status]||["?",""];return<span className={`badge ${c}`}>{l}</span>;
  };

  const VBar=({p})=>{
    const t=p.forVotes+p.againstVotes;if(!t)return null;
    const fp=Math.round((p.forVotes/t)*100);
    return<div className="vbar-wrap"><div className="vbar"><div className="vbar-fill" style={{width:`${fp}%`}}/></div><div className="vstats"><span style={{color:"var(--green)"}}>{fp}% For ({p.forVotes.toLocaleString()})</span><span style={{color:"var(--text-dim)"}}>Quorum: {p.quorumPct}%</span><span style={{color:"var(--red)"}}>{100-fp}% Against</span></div></div>;
  };

  const PCard=({p})=>{
    const ua=getUA(p.sector,p.sectorId);
    return<div className={`prop-card s-${p.status}`} onClick={()=>openProp(p)}>
      <div className="prop-head"><div className="prop-title">{p.title}</div><Badge status={p.status}/></div>
      <div className="prop-meta"><span>{p.sector.toUpperCase()} · {p.sectorName.toUpperCase()}</span><span>by <UserLink username={p.author}/></span>{p.deadline&&<span>Closes {p.deadline}</span>}{ua>0?<span style={{color:"var(--blue)"}}>Your weight: {ua}pts</span>:<span style={{color:"var(--red)"}}>No allocation</span>}</div>
      {p.userVoted&&<div style={{marginTop:8,fontFamily:"var(--fmono)",fontSize:10,padding:"4px 8px",borderRadius:2,display:"inline-block",background:p.userVoted==="for"?"rgba(76,174,127,.15)":"rgba(224,82,82,.15)",color:p.userVoted==="for"?"var(--green)":"var(--red)"}}>✓ You voted {p.userVoted.toUpperCase()}</div>}
      {!p.userVoted&&p.repVote&&<div style={{marginTop:8,fontFamily:"var(--fmono)",fontSize:10,padding:"4px 8px",borderRadius:2,display:"inline-block",background:"rgba(74,158,255,.1)",color:"var(--blue)"}}>Rep voted {p.repVote.toUpperCase()} on your behalf</div>}
      <div className="prop-sum">{p.summary.length>160?p.summary.slice(0,160)+"…":p.summary}</div>
      {p.status!=="deliberation"&&<VBar p={p}/>}
    </div>;
  };

  const AboutDDTAP=()=><div>
    <div className="about-hero">
      <div className="about-tag">THE CIVIC NETWORK · DDTAP</div>
      <div className="about-title">Direct Democracy Tax Allocation Platform</div>
      <div className="about-sub">A scalable framework for participatory governance that gives every Canadian direct control over how their taxes are allocated — and a real vote on how that money gets spent.</div>
    </div>
    <div className="about-grid">
      <div className="about-card"><div className="about-card-icon">⚖️</div><div className="about-card-title">Equal Participation</div><div className="about-card-text">Vote weight is based on percentage of allocation, not dollar amount. Whether you pay $1,000 or $100,000 in taxes, your influence in each sector is proportionally equal.</div></div>
      <div className="about-card"><div className="about-card-icon">🏛️</div><div className="about-card-title">No Political Parties</div><div className="about-card-text">DDTAP replaces partisan gridlock with direct citizen policymaking. No lobbyists, no backroom deals. Every vote, proposal, and dollar is publicly recorded on the civic ledger.</div></div>
      <div className="about-card"><div className="about-card-icon">📋</div><div className="about-card-title">Informed Voting</div><div className="about-card-text">Before voting on any proposal, citizens must pass a 10-question comprehension test. You have to read it to vote on it.</div></div>
    </div>
    <div className="about-sec">
      <div className="about-sec-title">How Tax Allocation Works</div>
      <div className="about-p">Every year at tax time, you log in and distribute your taxes. 30% goes automatically to Critical Infrastructure — national defence, hospitals, water systems, and the civic platform itself. The remaining 70% is yours to direct toward the sectors you care about most at the federal, provincial, and municipal level.</div>
      <div className="about-p">Every percentage point you allocate to a sector gives you one participation point there. Those points are your vote weight on any proposal in that sector. Allocate 20% to Healthcare — you have 20 votes on healthcare proposals. Allocate nothing — you have no say.</div>
      <div className="about-p">Corporate taxes follow citizen allocations automatically. Corporations do not vote. Their contributions are distributed across sectors proportional to how citizens collectively allocate their own taxes that year.</div>
    </div>
    <div className="about-sec">
      <div className="about-sec-title">Implementation Plan</div>
      <div className="phase-grid">
        <div className="phase-card"><div className="phase-num">PHASE 1</div><div className="phase-title">Pilot Program</div><div className="phase-dur">1–2 years</div><div className="phase-text">A few willing MLAs and MPs agree to listen to results from citizens testing the DDTAP in their ridings.</div></div>
        <div className="phase-card"><div className="phase-num">PHASE 2</div><div className="phase-title">Provincial Expansion</div><div className="phase-dur">3–5 years</div><div className="phase-text">Extend the system to replace provincial government structures. Moderators elected, citizen oversight juries formed.</div></div>
        <div className="phase-card"><div className="phase-num">PHASE 3</div><div className="phase-title">Legislative Transition</div><div className="phase-dur">5–10 years</div><div className="phase-text">A constitutional amendment or national referendum officially replaces the partisan representative model with DDTAP.</div></div>
      </div>
    </div>
    <div className="info-box">All numbers in this platform are fabricated for demonstration purposes. The actual percentages, quorum thresholds, and sector breakdowns would be decided by a vote of every Canadian citizen before the system goes live.</div>
    <a href="https://docs.google.com/document/d/1zIXFUa1ykOP8Cs8Sd7P3D8dUzFOOurWJPVlLG3bMBIo/edit?usp=sharing" target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"center",gap:8,marginTop:8,padding:"14px 18px",background:"rgba(200,168,75,.06)",border:"1px solid rgba(200,168,75,.2)",borderRadius:3,fontFamily:"var(--fmono)",fontSize:12,color:"var(--gold)",textDecoration:"none"}}>
      <span style={{fontSize:16}}>📄</span>Click here to read a more detailed description of what this looks like →
    </a>
  </div>;

  const AboutVG=()=><div>
    <div className="about-hero">
      <div className="about-tag">COMMUNITY PROGRAM · EDMONTON</div>
      <div className="about-title">Victory Gardens Network</div>
      <div className="about-sub">A food sharing network designed to fight food insecurity and promote local products and services. Member-driven: the people who use it fund it, govern it, and benefit from it.</div>
    </div>
    <div className="about-sec">
      <div className="about-sec-title">The Mission</div>
      <div className="about-p">Buy local first. If you can't buy locally, try to grow at home. If you can't grow at home, rent a community garden plot. Victory Gardens meets people at whatever level they can engage with the system.</div>
      <div className="about-p">The original Victory Gardens were a World War necessity — over 800,000 Canadians grew food on any land they could farm during WWI and WWII. Climate change is reshaping what can be grown and food insecurity in Canada is growing.</div>
    </div>
    <div className="about-sec">
      <div className="about-sec-title">Services</div>
      {[
        {icon:"🥦",name:"Grocery Box Service",text:"Members pay a monthly fee and choose from a catalogue of locally grown produce. Yields are tracked transparently — anything above the expected yield is distributed by community vote."},
        {icon:"🌱",name:"Volunteer Garden System",text:"Two paths: volunteer a plot on your front lawn maintained by VG volunteers, or volunteer your time to maintain gardens. Both earn you weekly grocery boxes."},
        {icon:"🌳",name:"Community Centre Garden",text:"The central hub. Freed up for things needing more space and specialized knowledge — fruit trees, long-timeline crops, storage, processing, and education."},
        {icon:"🍲",name:"Meals on Demand",text:"For community members who face barriers to preparing their own meals. Made from seasonal Victory Garden yields."},
        {icon:"🌿",name:"Landscaping Services",text:"Helping turn lawns into thriving permaculture food gardens, growing the network's production capacity one yard at a time."},
        {icon:"❄️",name:"Snow Removal",text:"Neighbourhood kids are paid to clear snow for residents with mobility issues while learning to manage a small business."},
      ].map(s=><div key={s.name} className="svc-item"><div className="svc-icon">{s.icon}</div><div><div className="svc-name">{s.name}</div><div className="svc-text">{s.text}</div></div></div>)}
    </div>
    <div className="about-sec">
      <div className="about-sec-title">Governance</div>
      <div className="about-p">Members don't just receive produce — they govern the program and decide its growth. Using the DDTAP model, members vote on how the Victory Gardens Network in their community should operate and expand. Only residents who participate get to decide.</div>
    </div>
    <a href="https://docs.google.com/document/d/1r7U6ENUMY8uzv7QbXcjP_MqKDxhWuh65K1gzVztbMIw/edit?usp=sharing" target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"center",gap:8,padding:"14px 18px",background:"rgba(200,168,75,.06)",border:"1px solid rgba(200,168,75,.2)",borderRadius:3,fontFamily:"var(--fmono)",fontSize:12,color:"var(--gold)",textDecoration:"none"}}>
      <span style={{fontSize:16}}>📄</span>Click here to read a more detailed description of what this looks like →
    </a>
  </div>;

  const AboutJasper=()=><div>
    <div className="about-hero">
      <div className="about-tag">ADULT PUPPET SERIES · EDMONTON, ALBERTA</div>
      <div className="about-title">Jasper Avenue</div>
      <div className="about-sub">If Mr. Dressup sat down in a garden version of the Animal Junction with a Big Bird-sized Magpie puppet radiating Red Green energy to explore why buying Canadian is harder than it should be, how the provincial political system works, and the steps our communities can take to fight food insecurity.</div>
    </div>
    <div className="about-grid">
      <div className="about-card"><div className="about-card-icon">🎭</div><div className="about-card-title">Format</div><div className="about-card-text">1 Season · 5 Episodes · 40–50 minutes each · Segments designed for social media. Filmed in real Edmonton locations.</div></div>
      <div className="about-card"><div className="about-card-icon">🎯</div><div className="about-card-title">Audience</div><div className="about-card-text">Adults 30–55, Albertan, civically curious. Built for people frightened by food insecurity who want to contribute to a better society.</div></div>
      <div className="about-card"><div className="about-card-icon">🎨</div><div className="about-card-title">Tone</div><div className="about-card-text">Patient, kind, honest, sincere, warm, fun. Never cynical, never punches down. The Magpie is never stupid — he is overconfident.</div></div>
    </div>
    <div className="about-sec">
      <div className="about-sec-title">The Cast</div>
      <div className="about-p"><strong style={{color:"var(--cream)"}}>The Magpie</strong> — Big Bird meets Red Green meets Ricky from Trailer Park Boys. Confidently taught the wrong way and confidently believes it until someone they trust corrects them. Forms deep bonds, exceptional memory, chaotic but effective problem solver.</div>
      <div className="about-p"><strong style={{color:"var(--cream)"}}>The Human Host</strong> — Possesses the most patience in human history. Never condescends. When the Magpie is wrong, the host asks a question that leads the Magpie to correct themselves. Always shows up at exactly the right moment.</div>
      <div className="about-p" style={{color:"var(--text-dim)",fontSize:12}}>Also featuring: Beaver · Snowbird Canadian Goose · Coyote Cop · Dodge Ram Cop · Moose · Bat · Hawk · Crow · Raven · Bear · Buffalo/Bison · Goat · Bunny · Squirrel · Cat · Human Mayor · Human Provincial Rep</div>
    </div>
    <div className="about-sec">
      <div className="about-sec-title">Episode Guide — Season 1</div>
      {[
        {num:"Episode 1",title:"Buy Canadian",text:"The Magpie tries to buy Canadian products and discovers it's much more complicated than it needs to be. The solution: buy from local farmer's markets or grow your own food. This leads the Magpie to discover Victory Gardens."},
        {num:"Episode 2",title:"Canadian Media",text:"The Magpie helps launch a Meals on Demand service and calls a local news organization. The interview is clipped to make the Magpie look like an idiot. The Magpie discovers a large portion of Canadian media and oil and gas corporations are owned by the same investment firms."},
        {num:"Episode 3",title:"'Not I,' Said the Duck",text:"The Magpie tries to get government to address unmet community needs. The province says it's municipal. The Mayor confirms it's municipal but the province controls the funding. The Magpie returns to Victory Gardens and the host explains the petition process."},
        {num:"Episode 4",title:"Two Birds Stoned at Once",text:"The Magpie decides to fix the system from inside. He learns how First Past the Post works and how bills get rushed through. Defeated, he returns to VG and realizes the Victory Garden Network already does what he was trying to build."},
        {num:"Episode 5",title:"We Can Do This. We Can Build It.",text:"The Magpie presents their idea to expand the Victory Garden Network using the DDTAP model. Every member they speak with has read the proposal, passed the comprehension test, left comments, and voted."},
      ].map(ep=><div key={ep.num} className="about-ep"><div className="about-ep-num">{ep.num.toUpperCase()}</div><div className="about-ep-title">{ep.title}</div><div className="about-ep-text">{ep.text}</div></div>)}
    </div>
    <div className="about-sec">
      <div className="about-sec-title">Recurring Segments</div>
      {[
        {name:"History of [Food]",dur:"1–2 min",text:"A short animation about the history of the episode's featured food — how it came to Alberta, its historical uses, and its impact today."},
        {name:"How to Grow [Food] in Edmonton",dur:"2–3 min",text:"An instructional video on growing this week's featured food in Edmonton, followed by a song about the plant's life cycle."},
        {name:"How to Make [Food]",dur:"3–5 min",text:"A spotlight on a local Edmonton restaurant making an Alberta signature dish. A genuine how-to from a chef who makes it every day."},
      ].map(s=><div key={s.name} className="svc-item"><div><div className="svc-name">{s.name} <span style={{fontFamily:"var(--fmono)",fontSize:10,color:"var(--blue)",marginLeft:8}}>{s.dur}</span></div><div className="svc-text">{s.text}</div></div></div>)}
      <div style={{marginTop:14,fontFamily:"var(--fmono)",fontSize:11,color:"var(--text-dim)"}}>Featured foods this season: Beef · Taber Corn · Tomatoes · Saskatoon Berries · Potatoes · Bison</div>
    </div>
    <a href="https://docs.google.com/document/d/1inE6Eh1vSrOJZPwOnqB5q_Cavck1Blw1xsyZOpZ_ioo/edit?usp=sharing" target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"center",gap:8,marginTop:8,padding:"14px 18px",background:"rgba(200,168,75,.06)",border:"1px solid rgba(200,168,75,.2)",borderRadius:3,fontFamily:"var(--fmono)",fontSize:12,color:"var(--gold)",textDecoration:"none"}}>
      <span style={{fontSize:16}}>📄</span>Click here to read a more detailed description of what this looks like →
    </a>
  </div>;

  const Dashboard=()=>{
    const av=proposals.filter(p=>p.status==="voting").length,voted=proposals.filter(p=>p.userVoted).length;
    return<div className="content">
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-val">${USER.taxPaid.toLocaleString()}</div><div className="stat-lbl">TAX YEAR 2026</div><div className="stat-sub">Annual contribution</div></div>
        <div className="stat-card"><div className="stat-val">{flexTotal("federal")+30}</div><div className="stat-lbl">FEDERAL POINTS</div><div className="stat-sub">Flex: {flexTotal("federal")} · Crit: 30</div></div>
        <div className="stat-card"><div className="stat-val">{av}</div><div className="stat-lbl">ACTIVE VOTES</div><div className="stat-sub">{proposals.filter(p=>p.status==="deliberation").length} in deliberation</div></div>
        <div className="stat-card"><div className="stat-val">{voted}</div><div className="stat-lbl">VOTES CAST</div><div className="stat-sub">{proposals.filter(p=>p.status==="voting"&&!p.userVoted).length} awaiting your vote</div></div>
      </div>
      <div className="two-col" style={{marginBottom:14}}>
        <div className="card"><div className="ctitle">Federal Allocation</div>{SECTORS.federal.flexible.map(s=>{const pct=savedAlloc.federal[s.id]||0;return<div key={s.id} className="sec-bar-row"><div className="sec-bar-name">{s.name}</div><div className="sec-bar-track"><div className="sec-bar-fill" style={{width:`${(pct/70)*100}%`,background:s.color}}/></div><div className="sec-bar-pct">{pct}%</div></div>;})}</div>
        <div className="card"><div className="ctitle">Recent Ledger Activity</div>{ledger.slice(0,5).map(e=><div key={e.id} className="act-item"><div className={`act-ico ${e.type==="VOTE"?"act-ico-vote":e.type==="PROPOSAL"?"act-ico-prop":"act-ico-alloc"}`}>{e.type==="VOTE"?"✓":e.type==="PROPOSAL"?"✎":e.type==="PASSED"?"✅":"⚡"}</div><div><div className="act-target">{e.action}: {e.target.length>36?e.target.slice(0,36)+"…":e.target}</div><div className="act-date"><UserLink username={e.actor}/> · {e.ts}</div></div></div>)}</div>
      </div>
      <div className="card"><div className="ctitle" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span>Active Proposals</span><button className="btn-p" onClick={()=>setShowCreate(true)}>+ New Proposal</button></div><div className="prop-list">{proposals.filter(p=>p.status==="voting").map(p=><PCard key={p.id} p={p}/>)}</div></div>
    </div>;
  };

  const renderAllocation=()=>{
    const lvl=govLevel,secs=SECTORS[lvl];
    const isLocked=taxYearMode!=="next";
    const curAlloc=taxYearMode==="next"?nextAlloc:alloc;
    const fu=taxYearMode==="next"?nextFlexTotal(lvl):flexTotal(lvl);
    const r=70-fu;
    return<div className="content">
      <div className="lvl-tabs" style={{marginBottom:16}}>
        <div className={`lvl-tab ${taxYearMode==="prev"?"active":""}`} onClick={()=>setTaxYearMode("prev")}>2025 — PREVIOUS</div>
        <div className={`lvl-tab ${taxYearMode==="current"?"active":""}`} onClick={()=>setTaxYearMode("current")}>2026 — CURRENT</div>
        <div className={`lvl-tab ${taxYearMode==="next"?"active":""}`} onClick={()=>setTaxYearMode("next")}>2027 — PLAN AHEAD</div>
      </div>
      {taxYearMode==="prev"&&<div className="info-box" style={{borderColor:"rgba(142,154,176,.3)",background:"rgba(142,154,176,.04)"}}>📁 Your 2025 allocation is archived and locked. Shown for reference only.</div>}
      {taxYearMode==="current"&&<div className="info-box" style={{borderColor:"rgba(224,82,82,.3)",background:"rgba(224,82,82,.04)"}}>🔒 Your 2026 tax allocation is locked. The tax deadline has passed and your votes are already weighted for this year. You can plan your 2027 allocation in the next tab.</div>}
      {taxYearMode==="next"&&<div className="info-box">You are planning your 2027 allocation. This will not affect your current voting rights — those are set by your 2026 allocation. Save your plan before the 2027 tax deadline.</div>}
      <div className="lvl-tabs">{["federal","provincial","municipal"].map(l=><div key={l} className={`lvl-tab ${govLevel===l?"active":""}`} onClick={()=>setGovLevel(l)}>{l.toUpperCase()}</div>)}</div>
      {!isLocked&&<div className="rem-bar"><span style={{color:"var(--text-dim)"}}>FLEXIBLE REMAINING:</span><span className="rem-val">{r}%</span><div className="rem-track"><div className="rem-fill" style={{width:`${(fu/70)*100}%`}}/></div><span style={{fontFamily:"var(--fmono)",fontSize:10,color:"var(--text-dim)"}}>{fu}/70 used</span></div>}
      <div className="crit-sec"><div className="crit-lbl">🔒 CRITICAL INFRASTRUCTURE (30% — MANDATORY)</div><div className="crit-grid">{secs.critical.map(s=><div key={s.id} className="crit-item"><span className="crit-name">{s.name}</span><span className="crit-pct">{s.pct}%</span></div>)}</div></div>
      <div className="card"><div className="ctitle">Flexible Allocation — 70%{isLocked&&" · LOCKED"}</div>
        {secs.flexible.map(s=>{
          const val=curAlloc[lvl][s.id]||0;
          const bg=`linear-gradient(to right,${s.color} 0%,${s.color} ${(val/70)*100}%,var(--border) ${(val/70)*100}%,var(--border) 100%)`;
          return<div key={s.id} className="alloc-row">
            <div className="alloc-head">
              <span className="alloc-name"><span style={{width:8,height:8,borderRadius:"50%",background:s.color,display:"inline-block",flexShrink:0}}/>{s.name}</span>
              <span className="alloc-pct">{val}% <span style={{color:"var(--text-dim)",fontSize:10}}>(~${Math.round(val*USER.taxPaid/100).toLocaleString()})</span></span>
            </div>
            {isLocked
              ?<div style={{height:5,background:bg,borderRadius:3,marginTop:2}}/>
              :<input type="range" min={0} max={70} step={1} value={val} style={{background:bg}} onChange={e=>updateNextAlloc(lvl,s.id,parseInt(e.target.value))}/>}
          </div>;
        })}
        {!isLocked&&<div style={{marginTop:22,display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
          <button className="save-btn" onClick={saveNextAlloc}>Save 2027 Plan to Ledger</button>
          {r>0&&<span style={{fontFamily:"var(--fmono)",fontSize:10,color:"var(--gold)"}}>⚠ {r}% unallocated — distributes to Critical Infrastructure at deadline</span>}
        </div>}
      </div>
    </div>;
  };

  const Proposals=()=>{
    const allSectors=[
      ...SECTORS.federal.flexible.map(s=>({...s,level:"federal",levelLabel:"Federal"})),
      ...SECTORS.federal.critical.map(s=>({...s,level:"federal",levelLabel:"Federal",color:"#c8a84b"})),
      ...SECTORS.provincial.flexible.map(s=>({...s,level:"provincial",levelLabel:"Provincial"})),
      ...SECTORS.provincial.critical.map(s=>({...s,level:"provincial",levelLabel:"Provincial",color:"#c8a84b"})),
      ...SECTORS.municipal.flexible.map(s=>({...s,level:"municipal",levelLabel:"Municipal"})),
      ...SECTORS.municipal.critical.map(s=>({...s,level:"municipal",levelLabel:"Municipal",color:"#c8a84b"})),
    ];

    if(selectedSector){
      const active=proposals.filter(p=>p.sectorId===selectedSector.id&&(p.status==="voting")&&(selectedSector.level==="federal"||(selectedSector.level==="provincial"&&p.province===USER.province)||(selectedSector.level==="municipal"&&p.municipality===USER.municipality)));
      const past=proposals.filter(p=>p.sectorId===selectedSector.id&&(p.status==="passed"||p.status==="failed")&&(selectedSector.level==="federal"||(selectedSector.level==="provincial"&&p.province===USER.province)||(selectedSector.level==="municipal"&&p.municipality===USER.municipality)));
      const isCritSector=SECTORS[selectedSector.level]?.critical.some(s=>s.id===selectedSector.id);
      const ua=isCritSector?(selectedSector.pct||10):savedAlloc[selectedSector.level]?.[selectedSector.id]||0;
      return<div className="content">
        <button className="back-btn" onClick={()=>{setSelectedSector(null);setShowPast(false);}}>← Back to Sectors</button>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}>
          <div style={{width:10,height:10,borderRadius:"50%",background:selectedSector.color||"var(--gold)",flexShrink:0}}/>
          <div style={{fontFamily:"var(--fmono)",fontSize:10,color:"var(--text-dim)"}}>{selectedSector.levelLabel.toUpperCase()} · SECTOR</div>
        </div>
        <div style={{fontFamily:"var(--fdisplay)",fontSize:24,fontWeight:700,marginBottom:6}}>{selectedSector.name}</div>
        <div style={{fontFamily:"var(--fmono)",fontSize:11,color:ua>0?"var(--gold)":"var(--text-dim)",marginBottom:22}}>
          {ua>0?`Your allocation: ${ua}% · ${ua} participation points`:"You have no allocation in this sector"}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{fontFamily:"var(--fmono)",fontSize:11,color:"var(--text-dim)"}}>{active.length} active proposal{active.length!==1?"s":""}</div>
          {ua>0&&<button className="btn-p" onClick={()=>{
            const allFlexIds=SECTORS[selectedSector.level]?.flexible.map(s=>s.id)||[];
            const isCrit=!allFlexIds.includes(selectedSector.id);
            const firstEligible=isCrit
              ?([...SECTORS[selectedSector.level].flexible].find(s=>savedAlloc[selectedSector.level][s.id]>0)||SECTORS[selectedSector.level].flexible[0]).id
              :selectedSector.id;
            setNewProp(p=>({...p,sectorId:firstEligible}));
            setShowCreate(true);
          }}>+ New Proposal</button>}
        </div>
        {active.length>0?<div className="prop-list">{active.map(p=><PCard key={p.id} p={p}/>)}</div>
          :<div style={{padding:"24px",textAlign:"center",fontFamily:"var(--fmono)",fontSize:12,color:"var(--text-dim)",background:"var(--bg-card)",border:"1px solid var(--border)",borderRadius:3}}>No active proposals in this sector</div>}
        {past.length>0&&<>
          <div className="past-toggle" onClick={()=>setShowPast(!showPast)}>
            <span style={{fontSize:14}}>{showPast?"▼":"▶"}</span>
            Past Proposals ({past.length})
            <span style={{marginLeft:"auto",fontSize:10}}>Votes are locked</span>
          </div>
          {showPast&&<div className="prop-list" style={{marginTop:10}}>{past.map(p=><PCard key={p.id} p={p}/>)}</div>}
        </>}
      </div>;
    }

    const LevelSection=({level,label})=>{
      const flex=SECTORS[level].flexible;
      const crit=SECTORS[level].critical;
      return<div style={{marginBottom:32}}>
        <div className="sector-level-title">
          <span style={{fontFamily:"var(--fmono)",fontSize:11,color:"var(--gold)",letterSpacing:".08em"}}>{label.toUpperCase()}</span>
        </div>
        <div style={{fontFamily:"var(--fmono)",fontSize:10,color:"var(--text-dim)",marginBottom:10,letterSpacing:".06em"}}>CRITICAL INFRASTRUCTURE</div>
        <div className="sector-grid" style={{marginBottom:18}}>
          {crit.map(s=>{
            const count=proposals.filter(p=>p.sectorId===s.id).length;
            return<div key={s.id} className="sector-card" style={{"--sc":"var(--gold)"}} onClick={()=>{setSelectedSector({...s,level,levelLabel:label,color:"#c8a84b"});setShowPast(false);}}>
              <style>{`.sector-card[data-id="${s.id}"]::before{background:#c8a84b}`}</style>
              <div style={{width:8,height:8,borderRadius:"50%",background:"#c8a84b"}}/>
              <div className="sector-card-name">{s.name}</div>
              <div className="sector-card-meta"><span>{count} proposal{count!==1?"s":""}</span><span style={{color:"var(--gold)"}}>🔒 {s.pct}% mandatory</span></div>
            </div>;
          })}
        </div>
        <div style={{fontFamily:"var(--fmono)",fontSize:10,color:"var(--text-dim)",marginBottom:10,letterSpacing:".06em"}}>FLEXIBLE SECTORS</div>
        <div className="sector-grid">
          {flex.map(s=>{
            const ua=savedAlloc[level][s.id]||0;
            const active=proposals.filter(p=>p.sectorId===s.id&&p.status==="voting").length;
            const past=proposals.filter(p=>p.sectorId===s.id&&(p.status==="passed"||p.status==="failed")).length;
            const hasAlloc=ua>0;
            return<div key={s.id} className={`sector-card ${hasAlloc?"has-alloc":""}`} style={{borderTopColor:hasAlloc?s.color:"var(--border)"}} onClick={()=>{setSelectedSector({...s,level,levelLabel:label});setShowPast(false);}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:s.color}}/>
              <div className="sector-card-name">{s.name}</div>
              <div className="sector-card-meta">
                <span>{active} active</span>
                {past>0&&<span>{past} past</span>}
              </div>
              {hasAlloc&&<div className="sector-card-alloc">{ua}pts · eligible to propose & vote</div>}
              {!hasAlloc&&<div style={{fontFamily:"var(--fmono)",fontSize:10,color:"var(--text-dim)",marginTop:8}}>No allocation</div>}
            </div>;
          })}
        </div>
      </div>;
    };

    return<div className="content">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div>
          <div style={{fontFamily:"var(--fdisplay)",fontSize:20,fontWeight:700}}>All Sectors</div>
          <div style={{fontFamily:"var(--fmono)",fontSize:11,color:"var(--text-dim)",marginTop:4}}>Click a sector to view its proposals</div>
        </div>
        <button className="btn-p" onClick={()=>setShowCreate(true)}>+ New Proposal</button>
      </div>
      <LevelSection level="federal" label="Federal"/>
      {USER.province&&<LevelSection level="provincial" label={`Provincial · ${USER.province}`}/>}
      {USER.municipality&&<LevelSection level="municipal" label={`Municipal · ${USER.municipality}`}/>}
    </div>;
  };

  const renderProposalDetail=()=>{
    const p=getSel();if(!p)return null;

    // Author review mode
    if(p.pendingAuthorReview&&p.author===USER.username&&p.status==="pending"){
      const draft=authorEditDraft||{title:p.title,summary:p.summary,questions:p.questions};
      return<div className="content">
        <button className="back-btn" onClick={()=>setView("proposals")}>← Back to Proposals</button>
        <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:10}}><Badge status={p.status}/></div>
        <div style={{fontFamily:"var(--fdisplay)",fontSize:22,fontWeight:700,marginBottom:6}}>{p.title}</div>
        <div className="info-box" style={{borderColor:"rgba(200,168,75,.3)"}}>
          The moderator team has reviewed your proposal and made edits. Review the changes below. You may edit before approving. When you are satisfied, click <strong style={{color:"var(--gold)"}}>Save & Approve</strong> to make the proposal live. This action is final.
        </div>

        <div className="card" style={{marginBottom:14}}>
          <div className="ctitle">Proposal Title</div>
          <input className="finput" value={draft.title} onChange={e=>setAuthorEditDraft(d=>({...(d||draft),title:e.target.value}))}/>
        </div>

        <div className="card" style={{marginBottom:14}}>
          <div className="ctitle">Proposal Summary</div>
          <textarea className="finput ftarea" value={draft.summary} onChange={e=>setAuthorEditDraft(d=>({...(d||draft),summary:e.target.value}))}/>
        </div>

        <div className="card" style={{marginBottom:14}}>
          <div className="ctitle">Comprehension Questions</div>
          {draft.questions.map((q,i)=><div key={i} style={{marginBottom:16,padding:12,background:"rgba(0,0,0,.2)",borderRadius:3}}>
            <div style={{fontFamily:"var(--fmono)",fontSize:10,color:"var(--gold)",marginBottom:6}}>Q{i+1}</div>
            <input className="finput" style={{marginBottom:8}} value={q.q} onChange={e=>setAuthorEditDraft(d=>{const qs=[...(d||draft).questions];qs[i]={...qs[i],q:e.target.value};return{...(d||draft),questions:qs};})}/>
            {q.opts.map((opt,j)=><div key={j} style={{display:"flex",gap:6,alignItems:"center",marginBottom:4}}>
              <input type="radio" checked={q.a===j} onChange={()=>setAuthorEditDraft(d=>{const qs=[...(d||draft).questions];qs[i]={...qs[i],a:j};return{...(d||draft),questions:qs};})} style={{accentColor:"var(--gold)"}}/>
              <input className="finput" style={{marginBottom:0}} value={opt} onChange={e=>setAuthorEditDraft(d=>{const qs=[...(d||draft).questions];qs[i]={...qs[i],opts:qs[i].opts.map((o,l)=>l===j?e.target.value:o)};return{...(d||draft),questions:qs};})}/>
            </div>)}
          </div>)}
        </div>

        <div className="card" style={{marginBottom:14}}>
          <div className="ctitle">Version History</div>
          {(propVersions[p.id]||[]).length===0&&<div style={{fontFamily:"var(--fmono)",fontSize:11,color:"var(--text-dim)"}}>No edits recorded.</div>}
          {[...(propVersions[p.id]||[])].reverse().map((v,i)=><div key={i} className="version-item">
            <div className="version-num">VERSION {v.version} · {v.created_at} · by {v.edited_by_username}</div>
            <div style={{fontSize:12,color:"var(--cream)",marginBottom:2}}>{v.title}</div>
            <div style={{fontSize:11,color:"var(--cream-dim)"}}>{v.summary.length>100?v.summary.slice(0,100)+"…":v.summary}</div>
          </div>)}
        </div>

        <button className="save-btn" style={{width:"100%"}} onClick={()=>setShowAuthorConfirm(true)}>
          Save & Approve → Make Live
        </button>

        {showAuthorConfirm&&<div className="modal-ov" onClick={e=>e.target===e.currentTarget&&setShowAuthorConfirm(false)}><div className="modal">
          <div className="modal-title">Are you sure?</div>
          <div className="modal-sub">Once approved, your proposal will go live on the platform and enter the voting phase. This cannot be undone. Citizens will be able to read, discuss, and vote on it.</div>
          <div className="modal-acts">
            <button className="btn-g" onClick={()=>setShowAuthorConfirm(false)}>Go Back</button>
            <button className="btn-p" onClick={()=>authorApprove(p.id,draft)}>Yes, Make It Live</button>
          </div>
        </div></div>}
      </div>;
    }
    const ua=getUA(p.sector,p.sectorId);
    const inJurisdiction=p.sector==="federal"||(p.sector==="provincial"&&p.province===USER.province)||(p.sector==="municipal"&&p.municipality===USER.municipality);
    const canVote=p.status==="voting"&&ua>0&&p.userPassedTest&&p.questions.length>0&&inJurisdiction;
    const tot=p.forVotes+p.againstVotes,fp=tot>0?Math.round((p.forVotes/tot)*100):0;
    const hasQ=p.questions.length>0;
    const tabs=["overview",...(hasQ&&!p.userPassedTest&&p.status==="voting"?["test"]:[]),"vote"];
    const noTest=!hasQ&&p.status==="voting";
    return<div className="content">
      <button className="back-btn" onClick={()=>setView("proposals")}>← Back to Proposals</button>
      <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:10}}><Badge status={p.status}/><span style={{fontFamily:"var(--fmono)",fontSize:10,color:"var(--text-dim)"}}>{p.sector.toUpperCase()} · {p.sectorName.toUpperCase()}</span></div>
      <div className="det-title">{p.title}</div>
      <div style={{fontFamily:"var(--fmono)",fontSize:10,color:"var(--text-dim)",display:"flex",gap:18,flexWrap:"wrap",marginBottom:22}}>
        <span>By <UserLink username={p.author}/></span><span>Filed {p.created}</span>{p.deadline&&<span>Closes {p.deadline}</span>}
        {ua>0?<span style={{color:"var(--blue)"}}>Your weight: {ua}pts</span>:<span style={{color:"var(--red)"}}>⚠ No allocation — cannot vote</span>}
      </div>
      <div className="dtabs">{tabs.map(t=><div key={t} className={`dtab ${dtab===t?"active":""}`} onClick={()=>setDtab(t)}>{t==="overview"?"Overview":t==="test"?"Comprehension Test":"Vote"}{t==="test"&&!p.userPassedTest&&<span style={{color:"var(--gold)",marginLeft:4}}>Required</span>}{t==="vote"&&p.userVoted&&<span style={{color:"var(--green)",marginLeft:4}}>✓</span>}</div>)}</div>
      {dtab==="overview"&&<div className="two-col">
        <div>
          <div className="card" style={{marginBottom:12}}><div className="ctitle">Proposal Summary</div><p style={{fontSize:13,lineHeight:1.8,color:"var(--cream-dim)"}}>{p.summary}</p></div>
          {p.status!=="deliberation"&&<div className="card"><div className="ctitle">Current Voting</div>{tot>0?<><div className="vbar" style={{height:8}}><div className="vbar-fill" style={{width:`${fp}%`}}/></div><div style={{display:"flex",justifyContent:"space-between",marginTop:10}}><div style={{fontFamily:"var(--fmono)",fontSize:11,color:"var(--green)"}}>▲ {fp}% For<br/><span style={{fontSize:10,color:"var(--text-dim)"}}>{p.forVotes.toLocaleString()} pts</span></div><div style={{fontFamily:"var(--fmono)",fontSize:11,color:"var(--red)",textAlign:"right"}}>▼ {100-fp}% Against<br/><span style={{fontSize:10,color:"var(--text-dim)"}}>{p.againstVotes.toLocaleString()} pts</span></div></div></>:<p style={{fontSize:12,color:"var(--text-dim)"}}>No votes yet.</p>}</div>}
        </div>
        <div>
          <div className="card" style={{marginBottom:12}}><div className="ctitle">Quorum Status</div><div style={{display:"flex",gap:18,alignItems:"center",marginTop:6}}><div className="quorum-ring"><svg width="76" height="76"><circle cx="38" cy="38" r="30" fill="none" stroke="var(--border)" strokeWidth="6"/><circle cx="38" cy="38" r="30" fill="none" stroke={p.quorumPct>=60?"var(--green)":"var(--blue)"} strokeWidth="6" strokeDasharray={`${(p.quorumPct/100)*188.5} 188.5`} strokeLinecap="round"/></svg><div className="qring-lbl" style={{color:p.quorumPct>=60?"var(--green)":"var(--blue)"}}>{p.quorumPct}%</div></div><div className="qmeta"><span>{p.quorumPct>=60?"✅ Quorum Met":"⏳ Quorum Pending"}</span>Requirement: 60%<br/>Majority: 50%+<br/>Eligible: {p.totalEligible.toLocaleString()}</div></div></div>
          <div className="card"><div className="ctitle">Your Participation</div><div style={{fontSize:12,lineHeight:2.2,fontFamily:"var(--fmono)",color:"var(--cream-dim)"}}><div>Sector allocation: <span style={{color:ua>0?"var(--gold)":"var(--red)"}}>{ua}pts</span></div><div>Comprehension test: <span style={{color:p.userPassedTest?"var(--green)":"var(--text-dim)"}}>{p.userPassedTest?"Passed ✓":"Not taken"}</span></div><div>Vote cast: <span style={{color:p.userVoted?"var(--green)":"var(--text-dim)"}}>{p.userVoted?p.userVoted.toUpperCase()+" ✓":"None"}</span></div></div>{p.status==="voting"&&!p.userPassedTest&&hasQ&&ua>0&&<button className="save-btn" style={{marginTop:14}} onClick={()=>setDtab("test")}>Take Test →</button>}{canVote&&<button className="save-btn" style={{marginTop:14}} onClick={()=>setDtab("vote")}>Cast Your Vote →</button>}</div>
        </div>
      </div>}
      {dtab==="test"&&<div className="card">{testDone?<><div className="score-disp"><div className={`score-num ${testScore>=5?"score-pass":"score-fail"}`}>{testScore}/10</div><div className="score-lbl" style={{color:testScore>=5?"var(--green)":"var(--red)"}}>{testScore>=5?"✅ PASSED — You may now vote":"❌ FAILED — Minimum 5/10 required"}</div>{testScore>=5?<button className="save-btn" style={{marginTop:22}} onClick={()=>setDtab("vote")}>Proceed to Vote →</button>:<button className="btn-g" style={{marginTop:22}} onClick={()=>{setTestAns({});setTestDone(false);setTestScore(null);}}>Retake Test</button>}</div><div style={{marginTop:22}}>{p.questions.map((q,i)=><div key={i} className="qblock"><div className="qnum">Q{i+1}</div><div className="qtext">{q.q}</div><div className="opts">{q.opts.map((opt,j)=>{const isSel=testAns[i]===j,isCorr=j===q.a;const cls=isSel&&isCorr?"corr":isSel?"incorr":isCorr?"corr":"";return<div key={j} className={`opt-btn ${cls}`}>{opt}</div>;})}</div></div>)}</div></>:<><div className="ctitle">Reading & Comprehension Test</div><p style={{fontSize:12,color:"var(--cream-dim)",marginBottom:22,lineHeight:1.7}}>Answer at least <strong style={{color:"var(--gold)"}}>5 of 10</strong> correctly to unlock voting.</p>{p.questions.map((q,i)=><div key={i} className="qblock"><div className="qnum">QUESTION {i+1} OF {p.questions.length}</div><div className="qtext">{q.q}</div><div className="opts">{q.opts.map((opt,j)=><button key={j} className={`opt-btn ${testAns[i]===j?"sel":""}`} onClick={()=>setTestAns(prev=>({...prev,[i]:j}))}>{opt}</button>)}</div></div>)}<button className="save-btn" style={{opacity:Object.keys(testAns).length<p.questions.length?.5:1}} onClick={()=>submitTest(p)}>Submit Test ({Object.keys(testAns).length}/{p.questions.length} answered)</button></>}</div>}
      {dtab==="vote"&&<div className="card"><div className="ctitle">Cast Your Vote</div>
        {p.status==="pending"?
          <div style={{padding:24,fontFamily:"var(--fmono)",fontSize:12,color:"var(--gold)"}}>⏳ This proposal is under moderator review. Voting will open once approved.</div>
        :p.status==="shelved"?
          <div style={{padding:24,fontFamily:"var(--fmono)",fontSize:12}}>
            <div style={{color:"var(--text-dim)",marginBottom:10}}>This proposal was shelved by the moderator team.</div>
            {p.shelveReason&&<div style={{padding:"10px 14px",background:"rgba(224,82,82,.08)",border:"1px solid rgba(224,82,82,.2)",borderRadius:2,color:"var(--red)",marginBottom:14}}>Reason: {p.shelveReason}</div>}
            {p.author===USER.username&&<>
              <div style={{color:"var(--cream-dim)",marginBottom:10,fontSize:12}}>As the author you may flag this decision to the Oversight Committee, or start a new proposal from scratch.</div>
              <button className="btn-g" style={{color:"var(--gold)",borderColor:"rgba(200,168,75,.3)"}} onClick={()=>setShowFlagModal(p.id)}>Flag to Oversight Committee</button>
            </>}
          </div>
        :noTest?
          <div style={{padding:28,textAlign:"center",fontFamily:"var(--fmono)",fontSize:12,color:"var(--red)"}}>⚠ This proposal has no comprehension test. Voting is blocked until a test is added by the moderator team.</div>
        :(p.status==="passed"||p.status==="failed")?
          <div style={{padding:24,fontFamily:"var(--fmono)",fontSize:12,color:"var(--text-dim)"}}>
            {p.userVoted?<span style={{color:"var(--green)"}}>✓ You voted {p.userVoted.toUpperCase()} on this proposal. The vote is now closed and your vote is permanently recorded.</span>:<span>This proposal has closed. Voting is no longer available.</span>}
          </div>
        :(!canVote&&!p.userVoted)?<div style={{padding:28,textAlign:"center",fontFamily:"var(--fmono)",fontSize:12}}>{ua===0?<span style={{color:"var(--red)"}}>No allocation in {p.sectorName}. Go to Tax Allocation first.</span>:!p.userPassedTest?<span style={{color:"var(--gold)"}}>Pass the comprehension test before voting. <button className="btn-g" style={{marginLeft:8}} onClick={()=>setDtab("test")}>Take Test</button></span>:<span>This proposal is not in the voting phase.</span>}</div>
        :<><p style={{fontSize:13,lineHeight:1.75,color:"var(--cream-dim)",marginBottom:16}}>{p.summary}</p>
          {p.repVote&&!p.userVoted&&<div style={{fontFamily:"var(--fmono)",fontSize:11,padding:"10px 14px",background:"rgba(74,158,255,.08)",border:"1px solid rgba(74,158,255,.2)",borderRadius:2,marginBottom:14,color:"var(--blue)"}}>Your representative voted <strong>{p.repVote.toUpperCase()}</strong> on your behalf. You can override this by casting your own vote below.</div>}
          <div style={{fontFamily:"var(--fmono)",fontSize:11,color:"var(--text-dim)",padding:"9px 12px",background:"rgba(0,0,0,.3)",borderRadius:2,marginBottom:18}}>Your vote carries <span style={{color:"var(--gold)"}}>{ua} participation points</span> in {p.sectorName}</div>
          <div className="vote-acts"><button className={`vote-btn vbf ${p.userVoted==="for"?"vactive":""}`} onClick={()=>castVote(p.id,"for")}>▲ VOTE FOR{p.userVoted==="for"&&" (Active)"}</button><button className={`vote-btn vba ${p.userVoted==="against"?"vactive":""}`} onClick={()=>castVote(p.id,"against")}>▼ VOTE AGAINST{p.userVoted==="against"&&" (Active)"}</button></div>
          {p.userVoted&&<p style={{marginTop:10,fontFamily:"var(--fmono)",fontSize:10,color:"var(--green)"}}>✓ Vote recorded. Click again to change or retract.</p>}
        </>}
      </div>}

      <div className="card" style={{marginTop:22}}>
        <div className="ctitle">Discussion</div>
        {ua===0&&<div style={{fontFamily:"var(--fmono)",fontSize:11,color:"var(--text-dim)",marginBottom:14}}>You must have allocation in {p.sectorName} to participate in this discussion.</div>}
        {(()=>{
          const allComments=discussions[p.id]||[];
          const renderThread=(parentId,depth)=>{
            const children=allComments.filter(c=>c.parentId===(parentId||null));
            if(children.length===0)return null;
            return children.map(c=>{
              const isHighlighted=highlightedComment===c.id;
              if(isHighlighted){setTimeout(()=>document.getElementById(`comment-${c.id}`)?.scrollIntoView({behavior:"smooth",block:"center"}),100);}
              return(
              <div key={c.id} style={{marginTop:10}}>
                <div id={`comment-${c.id}`} className="comment-box" style={isHighlighted?{borderLeftColor:"var(--gold)",background:"rgba(200,168,75,.08)",outline:"1px solid rgba(200,168,75,.3)"}:{}}>
                  <div className="comment-header">
                    <UserLink username={c.author}/>
                    <span>{c.ts}</span>
                  </div>
                  <div className="comment-text">{c.text}</div>
                  {ua>0&&<div style={{display:"flex",gap:6,marginTop:8,alignItems:"center"}}>
                    <textarea
                      className="finput"
                      rows={1}
                      style={{fontSize:12,padding:"6px 10px",resize:"none",flex:1,minHeight:"unset",lineHeight:1.4}}
                      placeholder={`Reply to @${c.author}…`}
                      value={replyingTo===c.id?replyDraft:""}
                      onFocus={()=>{setReplyingTo(c.id);setReplyDraft("");}}
                      onChange={e=>setReplyDraft(e.target.value)}
                      onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey&&replyDraft.trim()){e.preventDefault();addComment(p.id,c.id);}}}
                    />
                    {replyingTo===c.id&&replyDraft.trim()&&<button className="btn-p" style={{padding:"6px 12px",fontSize:11,flexShrink:0}} onClick={()=>addComment(p.id,c.id)}>Post</button>}
                  </div>}
                </div>
                {depth<10&&<div className="comment-children">{renderThread(c.id,depth+1)}</div>}
              </div>
            );});
          };
          return<>
            {allComments.filter(c=>!c.parentId).length===0&&<div style={{fontFamily:"var(--fmono)",fontSize:11,color:"var(--text-dim)",marginBottom:14}}>No comments yet. Start the discussion.</div>}
            {renderThread(null,0)}
          </>;
        })()}
        {ua>0&&<div style={{marginTop:16}}>
          <div style={{fontFamily:"var(--fmono)",fontSize:10,color:"var(--gold)",marginBottom:6}}>ADD A TOP-LEVEL COMMENT</div>
          <textarea className="finput ftarea" style={{minHeight:70,marginBottom:8}} placeholder="Be factual, relevant, and civil. All comments are public and recorded." value={commentDraft} onChange={e=>setCommentDraft(e.target.value)}/>
          <button className="btn-p" onClick={()=>addComment(p.id)} disabled={!commentDraft.trim()}>Post Comment</button>
        </div>}
      </div>
    </div>;
  };

  const Ledger=()=><div className="content">
    <div className="info-box">The Government-Hosted Distributed Ledger (GHDL) is an append-only, publicly verifiable record of all civic actions. Every entry is permanent and tamper-proof. <span style={{color:"var(--gold)"}}>Your entries are highlighted.</span> Click a row to open the proposal. Click an actor name to view their profile.</div>
    <div className="card"><div className="ctitle" style={{display:"flex",justifyContent:"space-between"}}><span>{ledger.length} Ledger Entries</span><span style={{fontFamily:"var(--fmono)",fontSize:10,color:"var(--green)"}}>● LIVE · GHDL v1.0</span></div>
    <div style={{overflowX:"auto"}}><table className="ledger-tbl"><thead><tr><th>ID</th><th>TYPE</th><th>ACTOR</th><th>ACTION</th><th>TARGET</th><th>SECTOR</th><th>TIME</th><th>WT</th></tr></thead><tbody>{ledger.map(e=>{
      const relatedProp=proposals.find(p=>p.title===e.target);
      return<tr key={e.id} style={{cursor:relatedProp?"pointer":"default"}} onClick={()=>{if(relatedProp){openProp(relatedProp);setView("proposal");}}}>
        <td style={{color:"var(--text-dim)"}}>{e.id}</td>
        <td><span className={`ltype lt-${e.type}`}>{e.type}</span></td>
        <td><span style={{color:e.actor===USER.username?"var(--gold)":"var(--blue)",cursor:"pointer",textDecoration:"underline"}} onClick={ev=>{ev.stopPropagation();setViewingProfile(e.actor);setView("profile");}}>{e.actor}</span></td>
        <td>{e.action}</td>
        <td style={{maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:relatedProp?"var(--cream)":"var(--cream-dim)"}}>{e.target}</td>
        <td style={{color:"var(--text-dim)"}}>{e.sector}</td>
        <td style={{color:"var(--text-dim)",whiteSpace:"nowrap"}}>{e.ts}</td>
        <td style={{color:"var(--blue)"}}>{e.pts}</td>
      </tr>;
    })}</tbody></table></div></div>
  </div>;

  const Profile=()=>{
    const isOwnProfile=!viewingProfile||viewingProfile===USER.username;
    const displayName=isOwnProfile?USER.name:viewingProfile;
    const displayUsername=isOwnProfile?USER.username:viewingProfile;
    const voted=proposals.filter(p=>p.userVoted&&isOwnProfile).length;
    const myProps=proposals.filter(p=>p.author===(isOwnProfile?USER.username:viewingProfile));
    const userLedger=ledger.filter(e=>e.actor===(isOwnProfile?USER.username:viewingProfile));
    return<div className="content">
      {!isOwnProfile&&<button className="back-btn" onClick={()=>{setViewingProfile(null);setView("ledger");}}>← Back to Ledger</button>}
      <div style={{display:"flex",gap:20,alignItems:"flex-start",marginBottom:28}}>
        <div className="profile-av">{displayName.charAt(0).toUpperCase()}</div>
        <div>
          <div className="profile-name">{displayName}</div>
          <div className="profile-user">@{displayUsername}</div>
          <div className="profile-bio">{isOwnProfile?`Citizen · ${USER.municipality}, ${USER.province} · DDTAP Pilot`:"DDTAP Citizen · Public Profile"}</div>
        </div>
      </div>
      {isOwnProfile&&<div className="card" style={{marginBottom:14}}>
        <div className="ctitle" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span>My Representatives</span>
          <button className="btn-p" style={{padding:"6px 14px",fontSize:11}} onClick={()=>setShowAssignRep(true)}>+ Assign Rep</button>
        </div>
        {myReps.length===0&&<div style={{fontFamily:"var(--fmono)",fontSize:11,color:"var(--text-dim)"}}>You have not assigned any representatives. A rep can vote on your behalf in sectors you designate.</div>}
        {myReps.map(r=><div key={r.sector_id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid rgba(26,51,85,.4)"}}>
          <div>
            <div style={{fontSize:13,color:"var(--cream)"}}>{r.sector_name}</div>
            <div style={{fontFamily:"var(--fmono)",fontSize:10,color:"var(--text-dim)",marginTop:2}}>
              Rep: <UserLink username={r.rep_username||"unknown"}/>  · {r.level}
            </div>
          </div>
          <button className="btn-g" style={{padding:"5px 12px",fontSize:10,color:"var(--red)",borderColor:"rgba(224,82,82,.3)"}} onClick={()=>removeRep(r.sector_id,r.sector_name)}>Remove</button>
        </div>)}
      </div>}

      {isOwnProfile&&repFor.length>0&&<div className="card" style={{marginBottom:14}}>
        <div className="ctitle">I Am Representing</div>
        <div style={{fontFamily:"var(--fmono)",fontSize:11,color:"var(--text-dim)",marginBottom:10}}>You are representing {repFor.length} citizen{repFor.length!==1?"s":""} in the following sectors. You must pass the comprehension test once per proposal to vote on their behalf.</div>
        {[...new Set(repFor.map(r=>r.sector_name))].map(sn=>{
          const citizens=repFor.filter(r=>r.sector_name===sn);
          return<div key={sn} style={{padding:"10px 0",borderBottom:"1px solid rgba(26,51,85,.4)"}}>
            <div style={{fontSize:13,color:"var(--cream)",marginBottom:4}}>{sn}</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {citizens.map(r=><span key={r.citizen_id} style={{fontFamily:"var(--fmono)",fontSize:10,padding:"2px 8px",background:"rgba(74,158,255,.1)",color:"var(--blue)",borderRadius:2}}>citizen</span>)}
            </div>
          </div>;
        })}
      </div>}
      {isOwnProfile&&<div className="two-col" style={{marginBottom:14}}>
        <div className="stat-card"><div className="stat-val">${USER.taxPaid.toLocaleString()}</div><div className="stat-lbl">2026 TAX CONTRIBUTION</div></div>
        <div className="stat-card"><div className="stat-val">{voted}</div><div className="stat-lbl">PROPOSALS VOTED</div></div>
      </div>}
      {isOwnProfile&&<div className="card" style={{marginBottom:14}}><div className="ctitle">Participation Points by Sector</div><div className="part-grid">{["federal","provincial","municipal"].map(lvl=><div key={lvl} className="part-card"><div className="part-lvl">{lvl.toUpperCase()}</div>{SECTORS[lvl].critical.slice(0,2).map(s=><div key={s.id} className="part-row"><span className="part-nm">{s.name}</span><span className="part-pts">{s.pct}pts</span></div>)}{SECTORS[lvl].flexible.filter(s=>savedAlloc[lvl][s.id]>0).map(s=><div key={s.id} className="part-row"><span className="part-nm" style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:6,height:6,borderRadius:"50%",background:s.color,display:"inline-block",flexShrink:0}}/>{s.name.length>17?s.name.slice(0,17)+"…":s.name}</span><span className="part-pts">{savedAlloc[lvl][s.id]}pts</span></div>)}</div>)}</div></div>}
      {myProps.length>0&&<div className="card" style={{marginBottom:14}}><div className="ctitle">Proposals Filed</div><div className="prop-list">{myProps.map(p=><PCard key={p.id} p={p}/>)}</div></div>}
      {(()=>{
        const userComments=Object.entries(discussions).flatMap(([propId,comments])=>
          comments.filter(c=>c.author===displayUsername).map(c=>({...c,proposalId:propId}))
        ).sort((a,b)=>b.id-a.id);
        if(userComments.length===0)return null;
        return<div className="card" style={{marginBottom:14}}>
          <div className="ctitle">Comment History</div>
          {userComments.map(c=>{
            const relProp=proposals.find(p=>p.id===c.proposalId);
            return<div key={c.id} style={{padding:"12px 0",borderBottom:"1px solid rgba(26,51,85,.4)",cursor:relProp?"pointer":"default"}}
              onClick={()=>{if(relProp){openProp(relProp);setHighlightedComment(c.id);setView("proposal");}}}>
              <div style={{fontFamily:"var(--fmono)",fontSize:10,color:"var(--text-dim)",marginBottom:4,display:"flex",gap:12}}>
                <span style={{color:relProp?"var(--blue)":"var(--text-dim)"}}>{relProp?relProp.title:"Unknown Proposal"}</span>
                <span>{c.ts}</span>
                {c.parentId&&<span style={{color:"var(--gold)"}}>↩ reply</span>}
              </div>
              <div style={{fontSize:13,color:"var(--cream-dim)",lineHeight:1.6}}>{c.text.length>120?c.text.slice(0,120)+"…":c.text}</div>
            </div>;
          })}
        </div>;
      })()}
      <div className="card"><div className="ctitle">Civic Ledger History</div>
        {userLedger.length===0?<div style={{fontFamily:"var(--fmono)",fontSize:12,color:"var(--text-dim)"}}>No civic activity recorded yet.</div>
        :<div style={{overflowX:"auto"}}><table className="ledger-tbl"><thead><tr><th>TYPE</th><th>ACTION</th><th>TARGET</th><th>SECTOR</th><th>TIME</th><th>WT</th></tr></thead><tbody>{userLedger.map(e=>{
          const relatedProp=proposals.find(p=>p.title===e.target);
          return<tr key={e.id} style={{cursor:relatedProp?"pointer":"default"}} onClick={()=>{if(relatedProp){openProp(relatedProp);setView("proposal");}}}>
            <td><span className={`ltype lt-${e.type}`}>{e.type}</span></td>
            <td>{e.action}</td>
            <td style={{maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:relatedProp?"var(--cream)":"var(--cream-dim)"}}>{e.target}</td>
            <td style={{color:"var(--text-dim)"}}>{e.sector}</td>
            <td style={{color:"var(--text-dim)",whiteSpace:"nowrap"}}>{e.ts}</td>
            <td style={{color:"var(--blue)"}}>{e.pts}</td>
          </tr>;
        })}</tbody></table></div>}
      </div>
    </div>;
  };

  const About=()=><div className="content">
    <div style={{fontFamily:"var(--fdisplay)",fontSize:20,fontWeight:700,marginBottom:6}}>The Projects</div>
    <div style={{fontFamily:"var(--fmono)",fontSize:11,color:"var(--text-dim)",marginBottom:28}}>Full documentation for each project in the Civic Network ecosystem.</div>
    {[
      {title:"The Civic Network",sub:"Direct Democracy Tax Allocation Platform",url:"https://docs.google.com/document/d/1zIXFUa1ykOP8Cs8Sd7P3D8dUzFOOurWJPVlLG3bMBIo/edit?usp=sharing",icon:"🏛️"},
      {title:"Victory Gardens",sub:"Community Food Network · Edmonton",url:"https://docs.google.com/document/d/1r7U6ENUMY8uzv7QbXcjP_MqKDxhWuh65K1gzVztbMIw/edit?usp=sharing",icon:"🌱"},
      {title:"Jasper Avenue",sub:"Adult Puppet Series · Edmonton, Alberta",url:"https://docs.google.com/document/d/1inE6Eh1vSrOJZPwOnqB5q_Cavck1Blw1xsyZOpZ_ioo/edit?usp=sharing",icon:"🎭"},
    ].map(p=><a key={p.title} href={p.url} target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"center",gap:18,padding:"22px 24px",background:"var(--bg-card)",border:"1px solid var(--border)",borderRadius:3,marginBottom:12,textDecoration:"none",transition:"all .15s",cursor:"pointer"}}
      onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--gold)";e.currentTarget.style.background="var(--bg-hover)";}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.background="var(--bg-card)";}}>
      <span style={{fontSize:28,flexShrink:0}}>{p.icon}</span>
      <div style={{flex:1}}>
        <div style={{fontFamily:"var(--fdisplay)",fontSize:16,fontWeight:600,color:"var(--cream)",marginBottom:4}}>{p.title}</div>
        <div style={{fontFamily:"var(--fmono)",fontSize:11,color:"var(--text-dim)"}}>{p.sub}</div>
      </div>
      <span style={{fontFamily:"var(--fmono)",fontSize:11,color:"var(--gold)",flexShrink:0}}>Read →</span>
    </a>)}
  </div>;

  const renderModDashboard=()=>{
    const pending=proposals;
    const modSelected=modSelectedId?proposals.find(p=>p.id===modSelectedId):null;

    if(modSelected){
      const versions=propVersions[modSelected.id]||[];
      const draft=modEditDraft||{title:modSelected.title,summary:modSelected.summary,questions:modSelected.questions};
      return<div className="content">
        <button className="back-btn" onClick={()=>{setModSelectedId(null);setModEditDraft(null);}}>← Back to Pending Proposals</button>
        <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:10}}><Badge status={modSelected.status}/></div>
        <div style={{fontFamily:"var(--fdisplay)",fontSize:22,fontWeight:700,marginBottom:6}}>{modSelected.title}</div>
        <div style={{fontFamily:"var(--fmono)",fontSize:11,color:"var(--text-dim)",marginBottom:22}}>
          By <UserLink username={modSelected.author}/> · Filed {modSelected.created} · {modSelected.sector.toUpperCase()} · {modSelected.sectorName}
          {modSelected.pendingAuthorReview&&<span style={{color:"var(--gold)",marginLeft:12}}>⏳ Awaiting author review</span>}
        </div>

        <div className="two-col" style={{marginBottom:22}}>
          <div>
            <div className="card" style={{marginBottom:14}}>
              <div className="ctitle">Edit Proposal</div>
              <div className="fgrp"><label className="flbl">TITLE</label><input className="finput" value={draft.title} onChange={e=>setModEditDraft(d=>({...d,title:e.target.value}))}/></div>
              <div className="fgrp"><label className="flbl">SUMMARY</label><textarea className="finput ftarea" value={draft.summary} onChange={e=>setModEditDraft(d=>({...d,summary:e.target.value}))}/></div>
            </div>
            <div className="card">
              <div className="ctitle">Comprehension Questions</div>
              {draft.questions.map((q,i)=><div key={i} style={{marginBottom:16,padding:12,background:"rgba(0,0,0,.2)",borderRadius:3}}>
                <div style={{fontFamily:"var(--fmono)",fontSize:10,color:"var(--gold)",marginBottom:6}}>Q{i+1}</div>
                <input className="finput" style={{marginBottom:8}} value={q.q} onChange={e=>setModEditDraft(d=>({...d,questions:d.questions.map((x,j)=>j===i?{...x,q:e.target.value}:x)}))}/>
                {q.opts.map((opt,j)=><div key={j} style={{display:"flex",gap:6,alignItems:"center",marginBottom:4}}>
                  <input type="radio" checked={q.a===j} onChange={()=>setModEditDraft(d=>({...d,questions:d.questions.map((x,k)=>k===i?{...x,a:j}:x)}))} style={{accentColor:"var(--gold)"}}/>
                  <input className="finput" style={{marginBottom:0}} value={opt} onChange={e=>setModEditDraft(d=>({...d,questions:d.questions.map((x,k)=>k===i?{...x,opts:x.opts.map((o,l)=>l===j?e.target.value:o)}:x)}))}/>
                </div>)}
              </div>)}
            </div>
          </div>

          <div>
            <div className="card" style={{marginBottom:14}}>
              <div className="ctitle">Peer Review — Production System</div>
              <div style={{fontFamily:"var(--fmono)",fontSize:10,color:"var(--text-dim)",lineHeight:1.9}}>
                <div style={{color:"var(--gold)",marginBottom:8}}>⚠ DEMO MODE · Peer review not enforced</div>
                In production, all mod actions require approval from 2 other moderators before taking effect:
                <div style={{marginTop:8,paddingLeft:10,borderLeft:"2px solid var(--border)"}}>
                  <div>1. Mod submits edits or a decision</div>
                  <div>2. Two other mods independently approve or reject</div>
                  <div>3. Two approvals → action proceeds to author</div>
                  <div>4. Two rejections → returned to original mod for revision</div>
                </div>
                <div style={{marginTop:8,color:"var(--cream-dim)"}}>No mod may approve their own submission. All peer review activity is publicly logged.</div>
              </div>
            </div>
            <div className="card" style={{marginBottom:14}}>
              <div className="ctitle">Actions</div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {modSelected.author===USER.username&&<div style={{fontFamily:"var(--fmono)",fontSize:11,padding:"10px 14px",background:"rgba(224,82,82,.08)",border:"1px solid rgba(224,82,82,.2)",borderRadius:2,color:"var(--red)"}}>⚠ You authored this proposal. You cannot edit, approve, or shelve your own proposals.</div>}
                {modSelected.author!==USER.username&&<>
                  <button className="btn-p" onClick={()=>modEditDraft&&modEditProposal(modSelected.id,draft.title,draft.summary,draft.questions)}>Save Edits & Send to Author</button>
                  <button className="save-btn" style={{width:"100%"}} onClick={()=>modApprove(modSelected.id)} disabled={modSelected.pendingAuthorReview}>
                    {modSelected.pendingAuthorReview?"Awaiting Author Response":"✓ Approve & Make Live"}
                  </button>
                  {(()=>{
                    const versions=propVersions[modSelected.id]||[];
                    const authorHasReplied=versions.length>0&&!modSelected.pendingAuthorReview;
                    return<>
                      <button className="btn-g" style={{color:"var(--red)",borderColor:"rgba(224,82,82,.3)",opacity:authorHasReplied?1:.4,cursor:authorHasReplied?"pointer":"not-allowed"}}
                        disabled={!authorHasReplied}
                        onClick={()=>setShowShelveModal(modSelected.id)}>
                        Shelve Proposal
                      </button>
                      {!authorHasReplied&&<div style={{fontFamily:"var(--fmono)",fontSize:10,color:"var(--text-dim)"}}>
                        {versions.length===0?"Send edits to the author first before shelving is available.":"Awaiting author's response before shelving is available."}
                      </div>}
                    </>;
                  })()}
                </>}
              </div>
            </div>

            <div className="card">
              <div className="ctitle">Version History ({versions.length} edits)</div>
              {versions.length===0&&<div style={{fontFamily:"var(--fmono)",fontSize:11,color:"var(--text-dim)"}}>No edits yet — original submission.</div>}
              {[...versions].reverse().map((v,i)=><div key={i} className="version-item">
                <div className="version-num">VERSION {v.version} · {v.created_at} · by {v.edited_by_username}</div>
                <div style={{fontSize:12,color:"var(--cream)",marginBottom:4}}>{v.title}</div>
                <div style={{fontSize:11,color:"var(--cream-dim)"}}>{v.summary.length>100?v.summary.slice(0,100)+"…":v.summary}</div>
              </div>)}
            </div>
          </div>
        </div>
      </div>;
    }

    return<div className="content">
      <div style={{fontFamily:"var(--fdisplay)",fontSize:20,fontWeight:700,marginBottom:6}}>Moderator Dashboard</div>
      <div style={{fontFamily:"var(--fmono)",fontSize:11,color:"var(--text-dim)",marginBottom:22}}>All proposals pending review. Your actions are publicly logged to the civic ledger.</div>
      {pending.length===0&&<div className="card"><div style={{fontFamily:"var(--fmono)",fontSize:12,color:"var(--text-dim)"}}>No proposals pending review.</div></div>}
      {pending.map(p=><div key={p.id} className="mod-card" onClick={()=>{setModSelectedId(p.id);setModEditDraft({title:p.title,summary:p.summary,questions:p.questions});}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
          <div>
            <div style={{fontFamily:"var(--fdisplay)",fontSize:15,fontWeight:600,marginBottom:4}}>{p.title}</div>
            <div style={{fontFamily:"var(--fmono)",fontSize:10,color:"var(--text-dim)"}}>By <UserLink username={p.author}/> · {p.sector.toUpperCase()} · {p.sectorName} · Filed {p.created}</div>
          </div>
          <div style={{display:"flex",gap:8,flexShrink:0}}>
            <Badge status={p.status}/>
            {p.pendingAuthorReview&&<span style={{fontFamily:"var(--fmono)",fontSize:10,padding:"2px 7px",background:"rgba(200,168,75,.15)",color:"var(--gold)",borderRadius:2}}>Author Review</span>}
          </div>
        </div>
        <div style={{marginTop:8,fontSize:12,color:"var(--cream-dim)"}}>{p.summary.length>120?p.summary.slice(0,120)+"…":p.summary}</div>
      </div>)}

      {showShelveModal&&<div className="modal-ov" onClick={e=>e.target===e.currentTarget&&setShowShelveModal(null)}><div className="modal">
        <div className="modal-title">Shelve Proposal</div>
        <div className="modal-sub">This will notify the author and move the proposal to shelved status. The author may flag this decision to the Oversight Committee.</div>
        <div className="fgrp"><label className="flbl">REASON FOR SHELVING</label><textarea className="finput ftarea" placeholder="Explain clearly why this proposal is being shelved…" value={shelveReason} onChange={e=>setShelveReason(e.target.value)}/></div>
        <div className="modal-acts">
          <button className="btn-g" onClick={()=>setShowShelveModal(null)}>Cancel</button>
          <button className="btn-p" style={{background:"var(--red)",color:"#fff"}} disabled={!shelveReason.trim()} onClick={()=>{modShelve(showShelveModal,shelveReason);setShowShelveModal(null);setShelveReason("");setModSelectedId(null);}}>Confirm Shelve</button>
        </div>
      </div></div>}
    </div>;
  };

  const renderOversightDashboard=()=>{
    const active=oversightFlags.filter(f=>f.status==="pending");
    const archived=oversightFlags.filter(f=>f.status==="resolved");
    const selected=oversightSelectedId?oversightFlags.find(f=>f.id===oversightSelectedId):null;

    if(selected){
      const p=proposals.find(x=>x.id===selected.proposal_id);
      const daysLeft=Math.ceil((new Date(selected.deadline)-new Date())/(1000*60*60*24));
      return<div className="content">
        <button className="back-btn" onClick={()=>setOversightSelectedId(null)}>← Back to Flags</button>
        <div style={{fontFamily:"var(--fdisplay)",fontSize:22,fontWeight:700,marginBottom:6}}>{selected.proposal_title}</div>
        <div style={{fontFamily:"var(--fmono)",fontSize:11,color:"var(--text-dim)",marginBottom:22}}>
          Flagged by <UserLink username={selected.author_username}/> · {selected.created_at}
          {selected.status==="pending"&&<span style={{color:daysLeft<14?"var(--red)":"var(--gold)",marginLeft:12}}>{daysLeft} days remaining</span>}
        </div>
        <div className="two-col">
          <div>
            <div className="card" style={{marginBottom:14}}>
              <div className="ctitle">Author's Reason for Flag</div>
              <p style={{fontSize:13,color:"var(--cream-dim)",lineHeight:1.7}}>{selected.reason}</p>
            </div>
            {p&&<div className="card">
              <div className="ctitle">Proposal (Shelved)</div>
              <div style={{fontFamily:"var(--fdisplay)",fontSize:15,fontWeight:600,marginBottom:8}}>{p.title}</div>
              <p style={{fontSize:13,color:"var(--cream-dim)",lineHeight:1.7,marginBottom:8}}>{p.summary}</p>
              {p.shelveReason&&<div style={{fontFamily:"var(--fmono)",fontSize:11,padding:"10px 14px",background:"rgba(224,82,82,.08)",border:"1px solid rgba(224,82,82,.2)",borderRadius:2,color:"var(--red)"}}>Mod shelve reason: {p.shelveReason}</div>}
            </div>}
          </div>
          <div>
            <div className="card" style={{marginBottom:14}}>
              <div className="ctitle">Version History</div>
              {(propVersions[selected.proposal_id]||[]).length===0&&<div style={{fontFamily:"var(--fmono)",fontSize:11,color:"var(--text-dim)"}}>No mod edits were made.</div>}
              {(propVersions[selected.proposal_id]||[]).map((v,i)=><div key={i} className="version-item">
                <div className="version-num">VERSION {v.version} · {v.created_at} · by {v.edited_by_username}</div>
                <div style={{fontSize:12,color:"var(--cream)"}}>{v.title}</div>
                <div style={{fontSize:11,color:"var(--cream-dim)"}}>{v.summary.length>80?v.summary.slice(0,80)+"…":v.summary}</div>
              </div>)}
            </div>
            {selected.status==="pending"&&<div className="card">
              <div className="ctitle">Cast Your Vote</div>
              <div style={{display:"flex",gap:10,flexDirection:"column"}}>
                <button className="save-btn" style={{width:"100%"}} onClick={()=>oversightVote(selected.id,"reinstate","Oversight committee determined the proposal was improperly shelved.")}>✓ Reinstate Proposal</button>
                <button className="btn-g" style={{color:"var(--red)",borderColor:"rgba(224,82,82,.3)",width:"100%"}} onClick={()=>oversightVote(selected.id,"uphold","Oversight committee upheld the moderator's decision.")}>✗ Uphold Shelving</button>
              </div>
            </div>}
            {selected.status==="resolved"&&<div className="card">
              <div className="ctitle">Outcome</div>
              <div style={{fontFamily:"var(--fmono)",fontSize:13,color:selected.outcome==="reinstate"?"var(--green)":"var(--red)"}}>
                {selected.outcome==="reinstate"?"✓ Proposal Reinstated":"✗ Shelving Upheld"}
              </div>
              {selected.votes.map((v,i)=><div key={i} style={{marginTop:10,fontSize:12,color:"var(--cream-dim)"}}><strong style={{color:"var(--cream)"}}>{v.voter}</strong>: {v.reasoning}</div>)}
            </div>}
          </div>
        </div>
      </div>;
    }

    return<div className="content">
      <div style={{fontFamily:"var(--fdisplay)",fontSize:20,fontWeight:700,marginBottom:6}}>Oversight Committee</div>
      <div style={{fontFamily:"var(--fmono)",fontSize:11,color:"var(--text-dim)",marginBottom:22}}>You are reviewing moderator decisions on shelved proposals at the request of authors. Votes must be cast within 90 days.</div>

      {active.length>0&&<><div style={{fontFamily:"var(--fmono)",fontSize:11,color:"var(--gold)",marginBottom:10,letterSpacing:".06em"}}>REQUIRES YOUR VOTE</div>
      {active.map(f=>{
        const daysLeft=Math.ceil((new Date(f.deadline)-new Date())/(1000*60*60*24));
        return<div key={f.id} className="flag-card urgent" style={{cursor:"pointer"}} onClick={()=>setOversightSelectedId(f.id)}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div style={{fontFamily:"var(--fdisplay)",fontSize:15,fontWeight:600}}>{f.proposal_title}</div>
            <span style={{fontFamily:"var(--fmono)",fontSize:10,color:daysLeft<14?"var(--red)":"var(--gold)"}}>{daysLeft}d left</span>
          </div>
          <div style={{fontFamily:"var(--fmono)",fontSize:10,color:"var(--text-dim)",marginTop:4}}>Flagged by <UserLink username={f.author_username}/> · {f.created_at}</div>
          <div style={{fontSize:12,color:"var(--cream-dim)",marginTop:6}}>{f.reason.length>100?f.reason.slice(0,100)+"…":f.reason}</div>
        </div>;
      })}</>}

      <div style={{fontFamily:"var(--fmono)",fontSize:11,color:"var(--gold)",marginTop:22,marginBottom:10,letterSpacing:".06em"}}>ALL PROPOSALS</div>
      {proposals.length===0&&<div className="card"><div style={{fontFamily:"var(--fmono)",fontSize:12,color:"var(--text-dim)"}}>No proposals submitted yet.</div></div>}
      {proposals.map(p=><div key={p.id} className="mod-card" onClick={()=>setSelectedId(p.id)&&setView("proposal")}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
          <div>
            <div style={{fontFamily:"var(--fdisplay)",fontSize:15,fontWeight:600,marginBottom:4}}>{p.title}</div>
            <div style={{fontFamily:"var(--fmono)",fontSize:10,color:"var(--text-dim)"}}>By <UserLink username={p.author}/> · {p.sector.toUpperCase()} · {p.sectorName} · Filed {p.created}</div>
          </div>
          <Badge status={p.status}/>
        </div>
        <div style={{marginTop:8,fontSize:12,color:"var(--cream-dim)"}}>{p.summary.length>120?p.summary.slice(0,120)+"…":p.summary}</div>
      </div>)}

      {archived.length>0&&<><div style={{fontFamily:"var(--fmono)",fontSize:11,color:"var(--text-dim)",marginTop:22,marginBottom:10,letterSpacing:".06em"}}>ARCHIVED · RESOLVED FLAGS</div>
      {archived.map(f=><div key={f.id} className="flag-card" style={{cursor:"pointer",opacity:.7}} onClick={()=>setOversightSelectedId(f.id)}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div style={{fontFamily:"var(--fdisplay)",fontSize:14,fontWeight:600}}>{f.proposal_title}</div>
          <span style={{fontFamily:"var(--fmono)",fontSize:10,padding:"2px 7px",background:f.outcome==="reinstate"?"rgba(76,174,127,.15)":"rgba(224,82,82,.15)",color:f.outcome==="reinstate"?"var(--green)":"var(--red)",borderRadius:2}}>{f.outcome==="reinstate"?"Reinstated":"Upheld"}</span>
        </div>
        <div style={{fontFamily:"var(--fmono)",fontSize:10,color:"var(--text-dim)",marginTop:4}}>Resolved · {f.votes[0]?.ts}</div>
      </div>)}</>}

      {oversightFlags.length===0&&active.length===0&&<div style={{fontFamily:"var(--fmono)",fontSize:12,color:"var(--text-dim)",marginTop:8}}>No flags submitted yet.</div>}
    </div>;
  };

  const navItems=[
    {id:"dashboard",icon:"⬡",label:"Dashboard"},
    {id:"allocate",icon:"◈",label:"Tax Allocation"},
    {id:"proposals",icon:"◻",label:"Proposals"},
    {id:"ledger",icon:"≡",label:"Ledger"},
    {id:"about",icon:"◎",label:"About"},
    {id:"profile",icon:"○",label:"Profile"},
    ...(USER.role==="moderator"?[{id:"mod",icon:"⚑",label:"Mod Dashboard"}]:[]),
    ...(USER.role==="oversight"?[{id:"oversight",icon:"⊛",label:"Oversight"}]:[]),
  ];

  const vl={dashboard:"Dashboard",allocate:"Tax Allocation",proposals:"Proposals",proposal:"Proposal Detail",ledger:"Civic Ledger",profile:"My Profile",about:"About",mod:"Moderator Dashboard",oversight:"Oversight Committee"};
  const isActive=(id)=>view===id||(id==="proposals"&&view==="proposal");

  const handleLogout=async()=>{ await supabase.auth.signOut(); onLogout(); };

  return<>
    <style>{CSS}</style>
    <div className="app">
      {sidebarOpen&&<div className="sb-overlay" onClick={()=>setSidebarOpen(false)}/>}
      <aside className={`sidebar ${sidebarOpen?"open":""}`}>
        <div className="sb-logo"><h1>The Civic Network</h1><span>DDTAP · PILOT v0.1</span></div>
        <nav className="sb-nav">{navItems.map(n=><div key={n.id} className={`nav-item ${isActive(n.id)?"active":""}`} onClick={()=>navTo(n.id)}><span style={{fontSize:15,lineHeight:1}}>{n.icon}</span>{n.label}</div>)}</nav>
        <div className="sb-user">
          <div className="sb-user-name">{USER.name}</div>
          <div className="sb-user-sub">@{USER.username}</div>
          <div className="sb-user-sub" style={{marginTop:4,color:"var(--green)"}}>● Active Citizen</div>
          <div className="sb-user-sub" style={{marginTop:2}}>{USER.municipality}, {USER.province}</div>
          <div style={{marginTop:10,display:"flex",alignItems:"center",gap:10}}>
            <div style={{position:"relative",cursor:"pointer"}} onClick={()=>setShowNotifications(true)}>
              <span style={{fontFamily:"var(--fmono)",fontSize:10,color:"var(--text-dim)"}}>🔔 Notifications</span>
              {notifications.filter(n=>!n.read).length>0&&<span className="notif-badge">{notifications.filter(n=>!n.read).length}</span>}
            </div>
          </div>
          <div onClick={handleLogout} style={{marginTop:8,fontFamily:"var(--fmono)",fontSize:10,color:"var(--red)",cursor:"pointer"}}>Log out</div>
        </div>
      </aside>
      <main className="main">
        <div className="topbar">
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <button className="hamburger" onClick={()=>setSidebarOpen(!sidebarOpen)}>☰</button>
            <h2>{vl[view]}</h2>
          </div>
          <span className="topbar-meta">May 13, 2026 · {USER.municipality}, {USER.province}</span>
        </div>
        {view==="dashboard"&&<Dashboard/>}
        {view==="allocate"&&renderAllocation()}
        {view==="proposals"&&<Proposals/>}
        {view==="proposal"&&renderProposalDetail()}
        {view==="ledger"&&<Ledger/>}
        {view==="profile"&&<Profile/>}
        {view==="about"&&<About/>}
        {view==="mod"&&USER.role==="moderator"&&renderModDashboard()}
        {view==="oversight"&&USER.role==="oversight"&&renderOversightDashboard()}
      </main>
      <nav className="bottom-nav"><div className="bnav-items">{navItems.map(n=><button key={n.id} className={`bnav-item ${isActive(n.id)?"active":""}`} onClick={()=>navTo(n.id)}><span className="bnav-icon">{n.icon}</span>{n.label}</button>)}</div></nav>

      {showCreate&&<div className="modal-ov" onClick={e=>e.target===e.currentTarget&&(setShowCreate(false),setCreateStep(1))}><div className="modal" style={{maxWidth:createStep===2?"680px":"540px"}}>
        <div className="modal-title">{createStep===1?"Submit a Proposal":"Build the Comprehension Test"}</div>
        <div className="modal-sub">{createStep===1?"Only citizens with tax allocated to the target sector may submit proposals.":"Voters must answer at least 5 of these 10 questions correctly before they can vote. Write clear, fair questions based on your proposal."}</div>

        {createStep===1&&<>
          <div className="fgrp"><label className="flbl">PROPOSAL TITLE</label><input className="finput" placeholder="A clear, specific, actionable title…" value={newProp.title} onChange={e=>setNewProp(p=>({...p,title:e.target.value}))}/></div>
          <div className="fgrp"><label className="flbl">TARGET SECTOR</label>
            <select className="finput fsel" value={newProp.sectorId} onChange={e=>setNewProp(p=>({...p,sectorId:e.target.value}))}>
              <optgroup label="Federal">{[...SECTORS.federal.critical,...SECTORS.federal.flexible].map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</optgroup>
              <optgroup label="Provincial (Alberta)">{[...SECTORS.provincial.critical,...SECTORS.provincial.flexible].map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</optgroup>
              <optgroup label="Municipal (Edmonton)">{[...SECTORS.municipal.critical,...SECTORS.municipal.flexible].map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</optgroup>
            </select>
            {(()=>{const lvl=newProp.sectorId.startsWith("f")?"federal":newProp.sectorId.startsWith("p")?"provincial":"municipal";const ua=getUA(lvl,newProp.sectorId);return<div style={{marginTop:6,fontFamily:"var(--fmono)",fontSize:10,color:ua>0?"var(--green)":"var(--red)"}}>{ua>0?`✓ You have ${ua}% allocated — eligible to propose`:"⚠ You have 0% allocated here. Allocate taxes first."}</div>;})()}
          </div>
          <div className="fgrp"><label className="flbl">PROPOSAL SUMMARY</label><textarea className="finput ftarea" placeholder="Describe the proposal clearly. Voters must pass a comprehension test before voting…" value={newProp.summary} onChange={e=>setNewProp(p=>({...p,summary:e.target.value}))}/></div>
          <div className="modal-acts"><button className="btn-g" onClick={()=>setShowCreate(false)}>Cancel</button>
            {(()=>{const lvl=newProp.sectorId.startsWith("f")?"federal":newProp.sectorId.startsWith("p")?"provincial":"municipal";const ua=getUA(lvl,newProp.sectorId);return<button className="btn-p" disabled={!newProp.title||!newProp.summary||ua===0} onClick={()=>setCreateStep(2)}>Next: Build Quiz →</button>;})()}
          </div>
        </>}

        {createStep===2&&<>
          <div style={{maxHeight:"60vh",overflowY:"auto",paddingRight:4}}>
            {quizQs.map((q,i)=>(
              <div key={i} style={{marginBottom:24,padding:"16px",background:"rgba(0,0,0,.2)",borderRadius:3,border:"1px solid var(--border)"}}>
                <div style={{fontFamily:"var(--fmono)",fontSize:10,color:"var(--gold)",marginBottom:8}}>QUESTION {i+1} OF 10</div>
                <input className="finput" style={{marginBottom:10}} placeholder={`Question ${i+1}…`} value={q.q} onChange={e=>updateQ(i,"q",e.target.value)}/>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                  {q.opts.map((opt,j)=>(
                    <div key={j} style={{display:"flex",gap:6,alignItems:"center"}}>
                      <input type="radio" name={`correct-${i}`} checked={q.a===j} onChange={()=>updateQ(i,"a",j)} style={{accentColor:"var(--gold)",flexShrink:0,width:14,height:14,cursor:"pointer"}}/>
                      <input className="finput" style={{marginBottom:0,flex:1}} placeholder={`Option ${j+1}…`} value={opt} onChange={e=>updateOpt(i,j,e.target.value)}/>
                    </div>
                  ))}
                </div>
                <div style={{fontFamily:"var(--fmono)",fontSize:10,color:"var(--text-dim)"}}>● = correct answer</div>
              </div>
            ))}
          </div>
          <div className="modal-acts">
            <button className="btn-g" onClick={()=>setCreateStep(1)}>← Back</button>
            <button className="btn-p" disabled={!quizValid} onClick={createProposal} style={{opacity:quizValid?1:.5}}>
              {quizValid?"Submit Proposal to Ledger":"Fill all questions & options first"}
            </button>
          </div>
        </>}
      </div></div>}

      {showAssignRep&&<div className="modal-ov" onClick={e=>e.target===e.currentTarget&&setShowAssignRep(false)}><div className="modal">
        <div className="modal-title">Assign a Representative</div>
        <div className="modal-sub">Choose a sector and a citizen to represent you. They can vote on your behalf but cannot be compensated. You can override or remove them at any time.</div>
        <div className="fgrp"><label className="flbl">SECTOR</label>
          <select className="finput fsel" value={assignRepSector?.id||""} onChange={e=>{
            const all=[...SECTORS.federal.flexible,...SECTORS.provincial.flexible,...SECTORS.municipal.flexible];
            const sec=all.find(s=>s.id===e.target.value);
            const lvl=sec?.id.startsWith("f")?"federal":sec?.id.startsWith("p")?"provincial":"municipal";
            setAssignRepSector(sec?{...sec,level:lvl}:null);
          }}>
            <option value="">Select a sector…</option>
            <optgroup label="Federal">{[...SECTORS.federal.critical,...SECTORS.federal.flexible.filter(s=>savedAlloc.federal[s.id]>0)].map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</optgroup>
            <optgroup label="Provincial">{[...SECTORS.provincial.critical,...SECTORS.provincial.flexible.filter(s=>savedAlloc.provincial[s.id]>0)].map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</optgroup>
            <optgroup label="Municipal">{[...SECTORS.municipal.critical,...SECTORS.municipal.flexible.filter(s=>savedAlloc.municipal[s.id]>0)].map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</optgroup>
          </select>
        </div>
        <div className="fgrp"><label className="flbl">REPRESENTATIVE USERNAME</label>
          <input className="finput" placeholder="their_username" value={assignRepUsername} onChange={e=>setAssignRepUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,""))}/>
          <div style={{fontFamily:"var(--fmono)",fontSize:10,color:"var(--text-dim)",marginTop:6}}>They must have a DDTAP account. Compensation is prohibited by law.</div>
        </div>
        <div className="modal-acts">
          <button className="btn-g" onClick={()=>{setShowAssignRep(false);setAssignRepUsername("");}}>Cancel</button>
          <button className="btn-p" disabled={!assignRepSector||!assignRepUsername} onClick={()=>assignRep(assignRepSector.id,assignRepSector.name,assignRepSector.level,assignRepUsername)}>Assign Rep</button>
        </div>
      </div></div>}

      {showFlagModal&&<div className="modal-ov" onClick={e=>e.target===e.currentTarget&&setShowFlagModal(null)}><div className="modal">
        <div className="modal-title">Flag to Oversight Committee</div>
        <div className="modal-sub">Explain why you believe this proposal was improperly shelved. The Oversight Committee will audit the moderator's decision within 90 days.</div>
        <div className="fgrp"><label className="flbl">YOUR REASON</label><textarea className="finput ftarea" placeholder="Explain why you believe this shelving was unjustified…" value={flagReason} onChange={e=>setFlagReason(e.target.value)}/></div>
        <div className="modal-acts">
          <button className="btn-g" onClick={()=>setShowFlagModal(null)}>Cancel</button>
          <button className="btn-p" disabled={!flagReason.trim()} onClick={()=>{flagToOversight(showFlagModal,flagReason);setShowFlagModal(null);setFlagReason("");}}>Submit Flag</button>
        </div>
      </div></div>}

      {showNotifications&&<div className="modal-ov" onClick={e=>e.target===e.currentTarget&&setShowNotifications(false)}><div className="modal">
        <div className="modal-title">Notifications</div>
        {notifications.length===0&&<div style={{fontFamily:"var(--fmono)",fontSize:12,color:"var(--text-dim)"}}>No notifications yet.</div>}
        {notifications.map(n=><div key={n.id} style={{padding:"12px 0",borderBottom:"1px solid rgba(26,51,85,.4)"}}>
          <div style={{fontFamily:"var(--fmono)",fontSize:10,color:"var(--gold)",marginBottom:4}}>{n.type.toUpperCase()}</div>
          <div style={{fontSize:13,color:"var(--cream-dim)"}}>{n.message}</div>
        </div>)}
        <div className="modal-acts"><button className="btn-g" onClick={()=>setShowNotifications(false)}>Close</button></div>
      </div></div>}

      {notif&&<div className="notif">{notif}</div>}
    </div>
  </>;
}
