/**
 * Copyright 2024 Rohan Matta
 * @license Apache-2.0, see LICENSE for full text.
 */
 import { LitElement, html, css } from "lit";
 import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
 import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
 
 export class Project1 extends DDDSuper(I18NMixin(LitElement)) {
   static get tag() {
     return "project-1";
   }
 
   static get properties() {
     return {
       ...super.properties,
       siteUrl: { type: String },
       siteData: { type: Object },
       items: { type: Array }
     };
   }
 
   constructor() {
     super();
     this.siteUrl = '';
     this.siteData = null;
     this.items = [];
   }
 
   static get styles() {
     return [
       super.styles,
       css`
         :host {
           display: block;
           font-family: var(--ddd-font-navigation);
         }
         .wrapper {
           padding: 16px;
           background-color: var(--ddd-theme-accent);
         }
         .input-container {
           margin-bottom: 16px;
         }
         .overview {
           margin: 16px 0;
         }
         .card-container {
           display: flex;
           flex-wrap: wrap;
           gap: 16px;
         }
         .card {
           flex: 1 1 calc(25% - 16px);
           max-width: calc(25% - 16px);
           background: white;
           padding: 16px;
           box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
         }
         .card img {
           max-width: 100%;
         }
         .card a {
           color: var(--ddd-theme-primary);
         }
         @media (max-width: 768px) {
           .card {
             flex: 1 1 calc(50% - 16px);
           }
         }
         @media (max-width: 480px) {
           .card {
             flex: 1 1 100%;
           }
         }
       `
     ];
   }
 
   handleFetch() {
     let url = this.siteUrl;
     if (!url.endsWith('/site.json')) {
       url += '/site.json';
     }
 
     fetch(url)
       .then(response => {
         if (!response.ok) {
           throw new Error('Network response was not ok');
         }
         return response.json();
       })
       .then(data => {
         this.siteData = data;
         this.items = data.items || [];
       })
       .catch(error => {
         console.error('Error fetching site.json:', error);
         this.siteData = null;
         this.items = [];
       });
   }
 
   render() {
     return html`
       <div class="wrapper">
         <div class="input-container">
           <input
             type="text"
             placeholder="Enter HAX site URL"
             @input="${e => this.siteUrl = e.target.value}"
           />
           <button @click="${this.handleFetch}">Analyze</button>
         </div>
 
         ${this.siteData ? html`
           <div class="overview">
             <h2>${this.siteData.name}</h2>
             <p>${this.siteData.description}</p>
             <p>Theme: ${this.siteData.theme}</p>
             <p>Created: ${this.siteData.created}</p>
             <p>Last Updated: ${this.siteData.lastUpdated}</p>
             <img src="${this.siteData.logo}" alt="${this.siteData.name} logo" />
           </div>
 
           <div class="card-container">
             ${this.items.map(item => html`
               <div class="card">
                 <h3>${item.title}</h3>
                 <p>${item.description}</p>
                 <p>Last Updated: ${item.lastUpdated}</p>
                 <a href="${item.link}" target="_blank">View Content</a>
                 <a href="${item.source || 'index.html'}" target="_blank">View Source</a>
               </div>
             `)}
           </div>
         ` : html`<p>Please enter a valid HAX site URL to analyze.</p>`}
       </div>
     `;
   }
 }
 
 customElements.define(Project1.tag, Project1);
 