// src/pages/DesignSystemPage.jsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import './DesignSystem.css';

// ─────────────────────────────────────────────────────────────
// Token utilities
// ─────────────────────────────────────────────────────────────
function hexToHsl(hex) {
  let r = parseInt(hex.slice(1,3),16)/255, g = parseInt(hex.slice(3,5),16)/255, b = parseInt(hex.slice(5,7),16)/255;
  const max=Math.max(r,g,b), min=Math.min(r,g,b); let h,s,l=(max+min)/2;
  if(max===min){h=s=0;}else{const d=max-min;s=l>0.5?d/(2-max-min):d/(max+min);switch(max){case r:h=((g-b)/d+(g<b?6:0))/6;break;case g:h=((b-r)/d+2)/6;break;case b:h=((r-g)/d+4)/6;break;}}
  return [Math.round(h*360),Math.round(s*100),Math.round(l*100)];
}
function hslToHex(h,s,l){s/=100;l/=100;const a=s*Math.min(l,1-l);const f=n=>{const k=(n+h/30)%12;const c=l-a*Math.max(-1,Math.min(k-3,9-k,1));return Math.round(255*c).toString(16).padStart(2,'0');};return `#${f(0)}${f(8)}${f(4)}`;}
function derivePrimary(hex,isDark){
  const[h,s,l]=hexToHsl(hex);
  return isDark?{'--color-primary':hex,'--color-primary-hover':hslToHex(h,s,Math.min(l+8,90)),'--color-primary-light':hslToHex(h,Math.min(s,60),18),'--color-primary-border':hslToHex(h,Math.min(s,60),30)}
  :{'--color-primary':hex,'--color-primary-hover':hslToHex(h,s,Math.max(l-8,10)),'--color-primary-light':hslToHex(h,Math.min(s,70),95),'--color-primary-border':hslToHex(h,Math.min(s,60),82)};
}
function buildTokens(t,isDark){
  const primary=derivePrimary(t.primaryColor,isDark);
  const r=t.radius;
  return {...primary,'--radius-sm':`${Math.max(2,Math.round(r*.5))}px`,'--radius-md':`${r}px`,'--radius-lg':`${Math.round(r*1.5)}px`,'--radius-full':'9999px','--font-size-xs':`${Math.max(10,t.fontSize-3)}px`,'--font-size-sm':`${t.fontSize-1}px`,'--font-size-md':`${t.fontSize}px`,'--font-size-lg':`${t.fontSize+2}px`,'--space-2':`${t.spacing}px`,'--space-3':`${Math.round(t.spacing*1.5)}px`,'--space-4':`${t.spacing*2}px`,'--space-6':`${t.spacing*3}px`};
}
function tokensToCSS(tokens,theme){return `/* Nox Lab UI — exported tokens */\n[data-theme="${theme}"] {\n${Object.entries(tokens).map(([k,v])=>`  ${k}: ${v};`).join('\n')}\n}`;}

// ─────────────────────────────────────────────────────────────
// Base components
// ─────────────────────────────────────────────────────────────
const NoxButton=({variant='primary',size='md',children,onClick,disabled,type='button'})=>(
  <button type={type} className={`nox-btn nox-btn--${variant} nox-btn--${size}`} onClick={onClick} disabled={disabled}>{children}</button>
);
const NoxBadge=({variant='primary',children})=>(<span className={`nox-badge nox-badge--${variant}`}>{children}</span>);
const NoxInput=({placeholder,label,type='text',value,onChange,error})=>(
  <div className="nox-field">
    {label&&<label className="nox-label">{label}</label>}
    <input className={`nox-input${error?' nox-input--error':''}`} type={type} placeholder={placeholder} value={value} onChange={onChange}/>
    {error&&<span className="nox-field-error">{error}</span>}
  </div>
);

// ─────────────────────────────────────────────────────────────
// 1. TOAST SYSTEM
// ─────────────────────────────────────────────────────────────
const ToastContext = React.createContext(null);
let toastId = 0;
function ToastProvider({children}){
  const [toasts,setToasts]=useState([]);
  const add=useCallback((msg,type='success',duration=3500)=>{
    const id=++toastId;
    setToasts(p=>[...p,{id,msg,type}]);
    setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==id)),duration);
  },[]);
  const remove=useCallback(id=>setToasts(p=>p.filter(t=>t.id!==id)),[]);
  return(
    <ToastContext.Provider value={add}>
      {children}
      <div className="toast-container">
        {toasts.map(t=>(
          <div key={t.id} className={`toast toast--${t.type}`}>
            <span className="toast-icon">{t.type==='success'?'✓':t.type==='error'?'✕':t.type==='warning'?'⚠':'ℹ'}</span>
            <span className="toast-msg">{t.msg}</span>
            <button className="toast-close" onClick={()=>remove(t.id)}>✕</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
const useToast=()=>React.useContext(ToastContext);

function ToastDemo(){
  const toast=useToast();
  return(
    <div className="ds-preview">
      <p className="ds-demo-label">Click to trigger — toasts auto-dismiss after 3.5s</p>
      <div className="ds-row ds-row--wrap">
        <NoxButton variant="success" size="sm" onClick={()=>toast('Changes saved successfully!','success')}>Success</NoxButton>
        <NoxButton variant="danger"  size="sm" onClick={()=>toast('Something went wrong. Try again.','error')}>Error</NoxButton>
        <NoxButton variant="secondary" size="sm" onClick={()=>toast('You have 3 unread messages','warning')}>Warning</NoxButton>
        <NoxButton variant="outline" size="sm" onClick={()=>toast('New version available — v2.1.0','info')}>Info</NoxButton>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. MODAL
// ─────────────────────────────────────────────────────────────
function ModalDemo(){
  const [open,setOpen]=useState(false);
  const [step,setStep]=useState(1);
  const toast=useToast();
  const close=()=>{setOpen(false);setTimeout(()=>setStep(1),300);};
  const submit=()=>{close();setTimeout(()=>toast('Project created successfully!','success'),350);};
  return(
    <div className="ds-preview">
      <p className="ds-demo-label">Backdrop click · ESC key · focus trap</p>
      <NoxButton variant="primary" size="sm" onClick={()=>setOpen(true)}>Open modal</NoxButton>
      {open&&(
        <div className="modal-backdrop" onClick={e=>{if(e.target===e.currentTarget)close();}}>
          <div className="modal" role="dialog" aria-modal="true">
            <div className="modal-header">
              <h3 className="modal-title">Create new project</h3>
              <button className="modal-close" onClick={close}>✕</button>
            </div>
            <div className="modal-body">
              {step===1&&(
                <div className="ds-col">
                  <NoxInput label="Project name" placeholder="My awesome app" />
                  <NoxInput label="Description" placeholder="What is this project about?" />
                  <div className="nox-field">
                    <label className="nox-label">Project type</label>
                    <select className="nox-input nox-select">
                      <option>UI/UX Design</option>
                      <option>Design System</option>
                      <option>Branding</option>
                    </select>
                  </div>
                </div>
              )}
              {step===2&&(
                <div className="ds-col">
                  <NoxInput label="Client name" placeholder="Acme Corp" />
                  <NoxInput label="Budget" placeholder="€ 0" type="number" />
                  <NoxInput label="Deadline" type="date" />
                </div>
              )}
            </div>
            <div className="modal-footer">
              <div className="modal-steps">Step {step} of 2</div>
              <div className="ds-row">
                {step===2&&<NoxButton variant="ghost" size="sm" onClick={()=>setStep(1)}>Back</NoxButton>}
                <NoxButton variant="secondary" size="sm" onClick={close}>Cancel</NoxButton>
                {step===1
                  ?<NoxButton variant="primary" size="sm" onClick={()=>setStep(2)}>Next →</NoxButton>
                  :<NoxButton variant="primary" size="sm" onClick={submit}>Create project</NoxButton>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. DROPDOWN MENU
// ─────────────────────────────────────────────────────────────
const MENU_ITEMS=[
  {icon:'✏️',label:'Edit',shortcut:'⌘E'},
  {icon:'📋',label:'Duplicate',shortcut:'⌘D'},
  {icon:'🔗',label:'Copy link',shortcut:'⌘L'},
  null, // divider
  {icon:'👥',label:'Share',shortcut:'⌘S',sub:[{label:'Public link'},{label:'Invite team'},{label:'Export PDF'}]},
  {icon:'⭐',label:'Add to favourites'},
  null,
  {icon:'🗑️',label:'Delete',shortcut:'⌫',danger:true},
];

function DropdownDemo(){
  const [open,setOpen]=useState(false);
  const [activeSub,setActiveSub]=useState(null);
  const toast=useToast();
  const ref=useRef();
  useEffect(()=>{
    const h=(e)=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);};
    document.addEventListener('mousedown',h);
    return()=>document.removeEventListener('mousedown',h);
  },[]);
  const pick=(label)=>{setOpen(false);setActiveSub(null);toast(`"${label}" selected`,'info',2000);};
  return(
    <div className="ds-preview">
      <p className="ds-demo-label">Hover "Share" for sub-menu · keyboard shortcuts shown</p>
      <div className="dd-wrap" ref={ref}>
        <NoxButton variant="secondary" size="sm" onClick={()=>setOpen(o=>!o)}>
          Actions {open?'▲':'▼'}
        </NoxButton>
        {open&&(
          <div className="dd-menu">
            {MENU_ITEMS.map((item,i)=>item===null
              ?<div key={i} className="dd-divider"/>
              :(
                <div key={item.label}
                  className={`dd-item${item.danger?' dd-item--danger':''}${activeSub===item.label?' dd-item--active':''}`}
                  onMouseEnter={()=>setActiveSub(item.sub?item.label:null)}
                  onMouseLeave={()=>setActiveSub(null)}
                  onClick={()=>item.sub?null:pick(item.label)}
                >
                  <span className="dd-icon">{item.icon}</span>
                  <span className="dd-label">{item.label}</span>
                  {item.shortcut&&<span className="dd-shortcut">{item.shortcut}</span>}
                  {item.sub&&<span className="dd-arrow">›</span>}
                  {item.sub&&activeSub===item.label&&(
                    <div className="dd-submenu">
                      {item.sub.map(s=>(
                        <div key={s.label} className="dd-item" onClick={e=>{e.stopPropagation();pick(s.label);}}>
                          <span className="dd-label">{s.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. COMMAND PALETTE
// ─────────────────────────────────────────────────────────────
const COMMANDS=[
  {icon:'📄',label:'New project',group:'Create',shortcut:'N'},
  {icon:'👤',label:'New contact',group:'Create',shortcut:'C'},
  {icon:'📊',label:'New report',group:'Create'},
  {icon:'🏠',label:'Go to Home',group:'Navigate'},
  {icon:'💼',label:'Go to Work',group:'Navigate'},
  {icon:'👋',label:'Go to About',group:'Navigate'},
  {icon:'✉️',label:'Go to Contact',group:'Navigate'},
  {icon:'🎨',label:'Design System',group:'Navigate'},
  {icon:'🌙',label:'Toggle dark mode',group:'Settings'},
  {icon:'🔔',label:'Notifications',group:'Settings'},
  {icon:'⌨️',label:'Keyboard shortcuts',group:'Settings'},
];

function CommandPaletteDemo(){
  const [open,setOpen]=useState(false);
  const [query,setQuery]=useState('');
  const [idx,setIdx]=useState(0);
  const toast=useToast();
  const inputRef=useRef();

  useEffect(()=>{
    const h=(e)=>{
      if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();setOpen(o=>!o);}
      if(e.key==='Escape')setOpen(false);
    };
    window.addEventListener('keydown',h);
    return()=>window.removeEventListener('keydown',h);
  },[]);

  useEffect(()=>{if(open)setTimeout(()=>inputRef.current?.focus(),50);},[open]);

  const filtered=COMMANDS.filter(c=>c.label.toLowerCase().includes(query.toLowerCase()));
  const groups=[...new Set(filtered.map(c=>c.group))];

  const handleKey=(e)=>{
    if(e.key==='ArrowDown'){e.preventDefault();setIdx(i=>Math.min(i+1,filtered.length-1));}
    if(e.key==='ArrowUp'){e.preventDefault();setIdx(i=>Math.max(i-1,0));}
    if(e.key==='Enter'&&filtered[idx]){run(filtered[idx]);}
  };
  const run=(cmd)=>{setOpen(false);setQuery('');toast(`Running: ${cmd.label}`,'info',2000);};

  return(
    <div className="ds-preview">
      <p className="ds-demo-label">Press <kbd>⌘K</kbd> anywhere on this page · or click the button</p>
      <NoxButton variant="outline" size="sm" onClick={()=>setOpen(true)}>
        <span>⌘K</span> Open palette
      </NoxButton>
      {open&&(
        <div className="cmd-backdrop" onClick={e=>{if(e.target===e.currentTarget)setOpen(false);}}>
          <div className="cmd-palette">
            <div className="cmd-search-row">
              <span className="cmd-search-icon">⌕</span>
              <input
                ref={inputRef}
                className="cmd-input"
                placeholder="Search commands..."
                value={query}
                onChange={e=>{setQuery(e.target.value);setIdx(0);}}
                onKeyDown={handleKey}
              />
              <kbd className="cmd-esc" onClick={()=>setOpen(false)}>ESC</kbd>
            </div>
            <div className="cmd-results">
              {filtered.length===0&&<div className="cmd-empty">No results for "{query}"</div>}
              {groups.map(group=>(
                <div key={group}>
                  <div className="cmd-group-label">{group}</div>
                  {filtered.filter(c=>c.group===group).map(cmd=>{
                    const globalIdx=filtered.indexOf(cmd);
                    return(
                      <div key={cmd.label} className={`cmd-item${globalIdx===idx?' cmd-item--active':''}`}
                        onMouseEnter={()=>setIdx(globalIdx)} onClick={()=>run(cmd)}>
                        <span className="cmd-item-icon">{cmd.icon}</span>
                        <span className="cmd-item-label">{cmd.label}</span>
                        {cmd.shortcut&&<kbd className="cmd-shortcut">{cmd.shortcut}</kbd>}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="cmd-footer">
              <span><kbd>↑↓</kbd> navigate</span>
              <span><kbd>↵</kbd> select</span>
              <span><kbd>ESC</kbd> close</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 5. DATA TABLE
// ─────────────────────────────────────────────────────────────
const TABLE_DATA=[
  {id:1,name:'Homepage redesign',client:'Acme Corp',status:'In progress',due:'2026-05-01',budget:12000},
  {id:2,name:'Design system v2',client:'NovaTech',status:'Review',due:'2026-04-15',budget:8500},
  {id:3,name:'Mobile app UI',client:'StartupXY',status:'Completed',due:'2026-03-20',budget:15000},
  {id:4,name:'Brand identity',client:'BlueLab',status:'In progress',due:'2026-06-01',budget:6000},
  {id:5,name:'Dashboard analytics',client:'DataFlow',status:'Draft',due:'2026-07-10',budget:9200},
  {id:6,name:'E-commerce UX audit',client:'ShopCo',status:'Completed',due:'2026-02-28',budget:4500},
  {id:7,name:'Onboarding flow',client:'SaaSBase',status:'Review',due:'2026-04-30',budget:7800},
];
const STATUS_VARIANT={Completed:'success','In progress':'primary',Review:'warning',Draft:'neutral'};
const COLS=[
  {key:'name',label:'Project'},
  {key:'client',label:'Client'},
  {key:'status',label:'Status'},
  {key:'due',label:'Due date'},
  {key:'budget',label:'Budget'},
];

function DataTableDemo(){
  const [sort,setSort]=useState({col:'name',dir:'asc'});
  const [selected,setSelected]=useState(new Set());
  const [page,setPage]=useState(0);
  const PER_PAGE=4;
  const toast=useToast();

  const sorted=[...TABLE_DATA].sort((a,b)=>{
    const av=a[sort.col],bv=b[sort.col];
    const cmp=typeof av==='number'?av-bv:String(av).localeCompare(String(bv));
    return sort.dir==='asc'?cmp:-cmp;
  });
  const pages=Math.ceil(sorted.length/PER_PAGE);
  const visible=sorted.slice(page*PER_PAGE,(page+1)*PER_PAGE);
  const allSelected=visible.every(r=>selected.has(r.id));
  const toggleAll=()=>{
    const s=new Set(selected);
    if(allSelected)visible.forEach(r=>s.delete(r.id));else visible.forEach(r=>s.add(r.id));
    setSelected(s);
  };
  const toggleRow=(id)=>{const s=new Set(selected);s.has(id)?s.delete(id):s.add(id);setSelected(s);};
  const doSort=(col)=>setSort(p=>({col,dir:p.col===col&&p.dir==='asc'?'desc':'asc'}));

  return(
    <div className="ds-preview ds-preview--flush">
      <div className="tbl-toolbar">
        <span className="tbl-count">{selected.size>0?`${selected.size} selected`:`${TABLE_DATA.length} projects`}</span>
        <div className="ds-row">
          {selected.size>0&&<NoxButton variant="danger" size="sm" onClick={()=>{setSelected(new Set());toast(`${selected.size} rows deleted`,'error');}}>Delete selected</NoxButton>}
          <NoxButton variant="secondary" size="sm" onClick={()=>toast('Exported to CSV','success')}>Export CSV</NoxButton>
        </div>
      </div>
      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th className="tbl-check"><input type="checkbox" checked={allSelected} onChange={toggleAll}/></th>
              {COLS.map(c=>(
                <th key={c.key} className="tbl-th" onClick={()=>doSort(c.key)}>
                  {c.label}
                  <span className="tbl-sort">{sort.col===c.key?(sort.dir==='asc'?'↑':'↓'):'↕'}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map(row=>(
              <tr key={row.id} className={`tbl-row${selected.has(row.id)?' tbl-row--selected':''}`} onClick={()=>toggleRow(row.id)}>
                <td className="tbl-check"><input type="checkbox" checked={selected.has(row.id)} onChange={()=>toggleRow(row.id)} onClick={e=>e.stopPropagation()}/></td>
                <td className="tbl-td tbl-td--bold">{row.name}</td>
                <td className="tbl-td">{row.client}</td>
                <td className="tbl-td"><NoxBadge variant={STATUS_VARIANT[row.status]}>{row.status}</NoxBadge></td>
                <td className="tbl-td">{row.due}</td>
                <td className="tbl-td">€{row.budget.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="tbl-pagination">
        <span className="tbl-page-info">Page {page+1} of {pages}</span>
        <div className="ds-row">
          <NoxButton variant="secondary" size="sm" onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0}>← Prev</NoxButton>
          <NoxButton variant="secondary" size="sm" onClick={()=>setPage(p=>Math.min(pages-1,p+1))} disabled={page===pages-1}>Next →</NoxButton>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 6. STEPPER FORM
// ─────────────────────────────────────────────────────────────
const STEPS=['Account','Profile','Preferences','Review'];
function StepperDemo(){
  const [step,setStep]=useState(0);
  const [form,setForm]=useState({email:'',password:'',name:'',role:'',theme:'light',notifications:true});
  const [errors,setErrors]=useState({});
  const toast=useToast();

  const set=(k)=>(e)=>setForm(p=>({...p,[k]:e.target.value}));

  const validate=()=>{
    const e={};
    if(step===0){if(!form.email.includes('@'))e.email='Valid email required.';if(form.password.length<6)e.password='Min 6 characters.';}
    if(step===1){if(!form.name.trim())e.name='Name is required.';}
    setErrors(e);return Object.keys(e).length===0;
  };

  const next=()=>{if(validate())setStep(s=>Math.min(s+1,STEPS.length-1));};
  const back=()=>{setErrors({});setStep(s=>Math.max(s-1,0));};
  const submit=()=>{toast('Account created successfully! Welcome aboard 🎉','success',4000);setStep(0);setForm({email:'',password:'',name:'',role:'',theme:'light',notifications:true});};

  return(
    <div className="ds-preview">
      {/* Step indicators */}
      <div className="stp-indicators">
        {STEPS.map((s,i)=>(
          <React.Fragment key={s}>
            <div className={`stp-dot${i===step?' stp-dot--active':i<step?' stp-dot--done':''}`}>
              {i<step?'✓':i+1}
            </div>
            <span className={`stp-label${i===step?' stp-label--active':''}`}>{s}</span>
            {i<STEPS.length-1&&<div className={`stp-line${i<step?' stp-line--done':''}`}/>}
          </React.Fragment>
        ))}
      </div>

      {/* Step content */}
      <div className="stp-body">
        {step===0&&<div className="ds-col">
          <NoxInput label="Email address" placeholder="you@example.com" type="email" value={form.email} onChange={set('email')} error={errors.email}/>
          <NoxInput label="Password" placeholder="Min 6 characters" type="password" value={form.password} onChange={set('password')} error={errors.password}/>
        </div>}
        {step===1&&<div className="ds-col">
          <NoxInput label="Full name" placeholder="Davide Gomiero" value={form.name} onChange={set('name')} error={errors.name}/>
          <div className="nox-field">
            <label className="nox-label">Role</label>
            <select className="nox-input nox-select" value={form.role} onChange={set('role')}>
              <option value="">Select a role...</option>
              <option>Product Designer</option><option>UX Researcher</option><option>Frontend Developer</option><option>Design Lead</option>
            </select>
          </div>
        </div>}
        {step===2&&<div className="ds-col">
          <div className="nox-field">
            <label className="nox-label">Preferred theme</label>
            <div className="stp-radio-group">
              {['light','dark','system'].map(t=>(
                <label key={t} className={`stp-radio${form.theme===t?' stp-radio--active':''}`}>
                  <input type="radio" name="theme" value={t} checked={form.theme===t} onChange={set('theme')}/>
                  {t.charAt(0).toUpperCase()+t.slice(1)}
                </label>
              ))}
            </div>
          </div>
          <div className="nox-field">
            <label className="nox-label">Email notifications</label>
            <label className="stp-toggle">
              <input type="checkbox" checked={form.notifications} onChange={e=>setForm(p=>({...p,notifications:e.target.checked}))}/>
              <span className="stp-toggle-track"><span className="stp-toggle-thumb"/></span>
              <span>{form.notifications?'Enabled':'Disabled'}</span>
            </label>
          </div>
        </div>}
        {step===3&&<div className="stp-review">
          {[['Email',form.email||'—'],['Name',form.name||'—'],['Role',form.role||'—'],['Theme',form.theme],['Notifications',form.notifications?'On':'Off']].map(([k,v])=>(
            <div key={k} className="stp-review-row"><span className="stp-review-key">{k}</span><span className="stp-review-val">{v}</span></div>
          ))}
        </div>}
      </div>

      {/* Navigation */}
      <div className="stp-nav">
        <NoxButton variant="ghost" size="sm" onClick={back} disabled={step===0}>← Back</NoxButton>
        {step<STEPS.length-1
          ?<NoxButton variant="primary" size="sm" onClick={next}>Continue →</NoxButton>
          :<NoxButton variant="success" size="sm" onClick={submit}>Create account ✓</NoxButton>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Token controls
// ─────────────────────────────────────────────────────────────
const Slider=({label,value,min,max,unit='',onChange})=>(
  <div className="ds-control">
    <div className="ds-control-header"><span className="ds-control-label">{label}</span><span className="ds-control-value">{value}{unit}</span></div>
    <input type="range" min={min} max={max} value={value} className="ds-slider" onChange={e=>onChange(Number(e.target.value))}/>
  </div>
);
const ColorPicker=({label,value,onChange})=>(
  <div className="ds-control">
    <div className="ds-control-header"><span className="ds-control-label">{label}</span><span className="ds-control-value ds-control-value--mono">{value}</span></div>
    <div className="ds-color-row">
      <input type="color" value={value} className="ds-color-input" onChange={e=>onChange(e.target.value)}/>
      <div className="ds-color-swatches">
        {['#3D52D5','#7C3AED','#DB2777','#DC2626','#059669','#0284C7','#D97706','#0F1117'].map(c=>(
          <button key={c} className={`ds-swatch${value===c?' ds-swatch--active':''}`} style={{background:c}} onClick={()=>onChange(c)}/>
        ))}
      </div>
    </div>
  </div>
);

const useCopy=()=>{
  const [copied,setCopied]=useState(false);
  const t=useRef(null);
  const copy=useCallback(text=>{navigator.clipboard.writeText(text).then(()=>{setCopied(true);clearTimeout(t.current);t.current=setTimeout(()=>setCopied(false),2000);});},[]);
  return{copy,copied};
};

// ─────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────
const DEFAULT={primaryColor:'#3D52D5',radius:8,fontSize:14,spacing:8};
const TABS=['Components','Complex','Typography','Colors'];

export default function DesignSystemPage(){
  const [theme,setTheme]=useState('light');
  const [tokens,setTokens]=useState(DEFAULT);
  const [activeTab,setActiveTab]=useState('Complex');
  const isDark=theme==='dark';
  const cssVars=buildTokens(tokens,isDark);
  const {copy,copied}=useCopy();
  const update=k=>v=>setTokens(p=>({...p,[k]:v}));

  return(
    <ToastProvider>
      <div className="ds-page" data-theme={theme} style={{...cssVars,'--font-family':"'Inter',-apple-system,sans-serif"}}>

        {/* Header */}
        <header className="ds-header">
          <div className="ds-header-left">
            <span className="ds-wordmark">Nox Lab UI</span>
            <span className="ds-version">v1.0</span>
          </div>
          <div className="ds-header-right">
            <div className="ds-theme-toggle">
              <button className={`ds-theme-btn${theme==='light'?' ds-theme-btn--active':''}`} onClick={()=>setTheme('light')}>Light</button>
              <button className={`ds-theme-btn${theme==='dark'?' ds-theme-btn--active':''}`} onClick={()=>setTheme('dark')}>Dark</button>
            </div>
            <button className="ds-reset-btn" onClick={()=>setTokens(DEFAULT)}>Reset</button>
            <button className="ds-export-btn" onClick={()=>copy(tokensToCSS(cssVars,theme))}>
              {copied?'✓ Copied!':'Export tokens'}
            </button>
          </div>
        </header>

        <div className="ds-body">
          {/* Sidebar */}
          <aside className="ds-sidebar">
            <p className="ds-sidebar-title">Design tokens</p>
            <ColorPicker label="Primary color" value={tokens.primaryColor} onChange={update('primaryColor')}/>
            <Slider label="Border radius" value={tokens.radius} min={0} max={24} unit="px" onChange={update('radius')}/>
            <Slider label="Base font size" value={tokens.fontSize} min={12} max={18} unit="px" onChange={update('fontSize')}/>
            <Slider label="Base spacing" value={tokens.spacing} min={4} max={16} unit="px" onChange={update('spacing')}/>
            <div className="ds-token-list">
              <p className="ds-sidebar-title" style={{marginTop:20}}>Live values</p>
              {Object.entries(cssVars).map(([k,v])=>(
                <div key={k} className="ds-token-row">
                  <span className="ds-token-name">{k}</span>
                  <span className="ds-token-val">{v.startsWith('#')&&<span className="ds-token-dot" style={{background:v}}/>}{v}</span>
                </div>
              ))}
            </div>
          </aside>

          {/* Main */}
          <main className="ds-main">
            <div className="ds-tabs">
              {TABS.map(t=>(
                <button key={t} className={`ds-tab${activeTab===t?' ds-tab--active':''}`} onClick={()=>setActiveTab(t)}>{t}</button>
              ))}
            </div>

            {/* COMPLEX COMPONENTS */}
            {activeTab==='Complex'&&(
              <div className="ds-sections">
                <Section title="Command palette" meta="⌘K · fuzzy search · keyboard navigation"><CommandPaletteDemo/></Section>
                <Section title="Data table" meta="Sortable · multi-select · pagination"><DataTableDemo/></Section>
                <Section title="Stepper form" meta="4 steps · validation · review"><StepperDemo/></Section>
                <Section title="Modal" meta="Backdrop dismiss · ESC · multi-step inside"><ModalDemo/></Section>
                <Section title="Dropdown menu" meta="Nested sub-menu · keyboard shortcuts · dividers"><DropdownDemo/></Section>
                <Section title="Toast notifications" meta="4 types · auto-dismiss · stackable"><ToastDemo/></Section>
              </div>
            )}

            {/* BASE COMPONENTS */}
            {activeTab==='Components'&&(
              <div className="ds-sections">
                <Section title="Button" meta="6 variants · 3 sizes">
                  <div className="ds-preview">
                    <div className="ds-row ds-row--wrap">
                      {['primary','secondary','danger','success','ghost','outline'].map(v=><NoxButton key={v} variant={v}>{v.charAt(0).toUpperCase()+v.slice(1)}</NoxButton>)}
                    </div>
                    <div className="ds-divider"/>
                    <div className="ds-row">
                      {['sm','md','lg'].map(s=><NoxButton key={s} variant="primary" size={s}>{s.toUpperCase()}</NoxButton>)}
                    </div>
                  </div>
                </Section>
                <Section title="Badge" meta="6 semantic variants">
                  <div className="ds-preview">
                    <div className="ds-row ds-row--wrap">
                      {['primary','success','warning','danger','info','neutral'].map(v=><NoxBadge key={v} variant={v}>{v}</NoxBadge>)}
                    </div>
                  </div>
                </Section>
                <Section title="Input" meta="Text · Email · Password">
                  <div className="ds-preview"><div className="ds-col">
                    <NoxInput label="Full name" placeholder="Davide Gomiero"/>
                    <NoxInput label="Email" placeholder="davide@example.com" type="email"/>
                    <NoxInput label="Password" placeholder="••••••••" type="password"/>
                  </div></div>
                </Section>
              </div>
            )}

            {/* TYPOGRAPHY */}
            {activeTab==='Typography'&&(
              <div className="ds-sections">
                <Section title="Type scale" meta="Inter · token-driven">
                  <div className="ds-preview">
                    {[['Display','2.5rem',700,'Design systems at scale'],['H1','2rem',700,'Building with intent'],['H2','1.5rem',600,'Component architecture'],['H3','1.125rem',600,'Token-driven design'],['Body lg','var(--font-size-lg)',400,'The quick brown fox — 16px regular.'],['Body md','var(--font-size-md)',400,'The quick brown fox — 14px regular.'],['Body sm','var(--font-size-sm)',400,'The quick brown fox — 13px regular.'],['Caption','var(--font-size-xs)',400,'Caption · metadata · labels']].map(([l,s,w,t])=>(
                      <div key={l} className="ds-type-row">
                        <span className="ds-type-label">{l}</span>
                        <span style={{fontSize:s,fontWeight:w,color:'var(--color-black)',lineHeight:1.3}}>{t}</span>
                      </div>
                    ))}
                  </div>
                </Section>
              </div>
            )}

            {/* COLORS */}
            {activeTab==='Colors'&&(
              <div className="ds-sections">
                {[['Primary','--color-primary','--color-primary-light','--color-primary-border','--color-primary-hover'],
                  ['Danger','--color-danger','--color-danger-light','--color-danger-border','--color-danger-hover'],
                  ['Success','--color-success','--color-success-light','--color-success-border','--color-success-hover']].map(([name,...vars])=>(
                  <Section key={name} title={name}>
                    <div className="ds-preview">
                      <div className="ds-color-scale">
                        {vars.map(v=>(
                          <div key={v} className="ds-color-chip">
                            <div className="ds-color-swatch-lg" style={{background:`var(${v})`,border:'1px solid var(--border-color)'}}/>
                            <span className="ds-color-chip-label">{v.replace('--color-','')}</span>
                            <span className="ds-color-chip-var">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Section>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}

// Tiny section wrapper
function Section({title,meta,children}){
  return(
    <div className="ds-section">
      <div className="ds-section-header">
        <h2 className="ds-section-title">{title}</h2>
        {meta&&<span className="ds-section-meta">{meta}</span>}
      </div>
      {children}
    </div>
  );
}