import {SystemConsts} from "../../SystemConsts.mjs";


export function BaseSheet(BaseApplication) {
  
    class BaseSheetClass extends foundry.applications.api.HandlebarsApplicationMixin(
        BaseApplication
    ) {
        constructor(options) {
            super(options);
            for ( const [groupId, groupData] of Object.entries(this.constructor.TABS) ) {
                groupData.tabs.forEach(tab => {
                    if((tab.id in this.constructor.PARTS))
                    {
                        this.constructor.PARTS[tab.id].tabs = {
                            group: groupId,
                        }   
                    }
                    else
                    {
                        console.error(tab.id , 'not in',  this.constructor.PARTS);
                    }
                });
            }
        }

        static DEFAULT_OPTIONS = {
            tag: 'form',
            form: {
                closeOnSubmit: false,
                submitOnChange: true
            },
            actions: {  },
            window: {
                resizable: true,
                controls: [  ]
            },
        }

        static PARTIALS = { };

        async _prepareContext(options) {

            const context = await super._prepareContext(options)
            context.system = this.document.system;
            
            context.tabs = {};

            for ( const [groupId, groupData] of Object.entries(this.constructor.TABS) ) {
                context.tabs[groupId] = { content: this._prepareTabs(groupId), html: ""};
                context.tabs[groupId].html = await foundry.applications.handlebars.renderTemplate(groupData.template ?? SystemConsts.TEMPLATES_PATH + "/models/tabs.hbs", {
                    id: groupId,
                    ...groupData,
                    tabs: context.tabs[groupId].content,
                    cssClass: groupData.cssClass ? groupData.cssClass.join(" ") : "",
                });

                Object.values(context.tabs[groupId].content).filter(t => t.visible == false).forEach(t => {
                    options.parts.splice(options.parts.indexOf(t.id), 1);
                });
            }

            return context
        }
        
        async _preRender(context, options) {
            await foundry.applications.handlebars.loadTemplates(this.constructor.PARTIALS ?? []);
            await super._preRender(context, options);
        }

        _getTabsConfig(group) {
            let data = foundry.utils.deepClone(super._getTabsConfig(group));

            data.tabs = data.tabs.map(t => {
                t.visible = t.condition == undefined || t.condition(this);
                return t;
            });

            return data;
        }

        async _preparePartContext(partId, context, options) {
            context = await super._preparePartContext(partId, context, options);
            
            const tab = this.constructor.PARTS[partId]?.tabs;
            if(tab) {
                context.tab = context.tabs[tab.group].content[partId];
                if(!options.tabData) {options.tabData = {};}
                options.tabData[partId] = context.tabs[tab.group].content[partId];
            }

            return context;
        }  


        _replaceHTML(result, content, options) {
            let includes = {};
            
            for ( const partId of Object.keys(result) ) {
                if(this.constructor.PARTS[partId] && this.constructor.PARTS[partId].container?.id) {
                    if(!includes[this.constructor.PARTS[partId].container.id]) {
                        includes[this.constructor.PARTS[partId].container.id] = [];
                    }
                    includes[this.constructor.PARTS[partId].container.id].push(partId);
                }

                if(this.constructor.PARTS[partId].tabs) {
                    if(result[partId].tagName !== "SECTION") {
                        let section = document.createElement("section");
                        section.dataset.group = this.constructor.PARTS[partId].tabs.group;
                        section.dataset.tab = partId;
                        section.classList.add("tab");
                        if(options.tabData[partId].cssClass) {section.classList.add(options.tabData[partId].cssClass);}
                        section.append(...result[partId].childNodes);
                        result[partId] = section;
                    }
                    else {
                        result[partId].dataset.group = this.constructor.PARTS[partId].tabs.group;
                        result[partId].dataset.tab = partId;
                        result[partId].classList.add("tab");
                        if(options.tabData[partId].cssClass) {result[partId].classList.add(options.tabData[partId].cssClass);}
                    }
                }
            }

            while(Object.values(includes).length > 0) {
                let somethingChanged = false;

                for ( const [containerId, partIds] of Object.entries(includes) ) {
                    if(partIds.filter(partId => {return partId in includes;}).length === 0) {
                    partIds.forEach(partId => {
                        const container = result[containerId].querySelector(this.constructor.PARTS[partId].container.element);
                        if(container) {
                        container.append(result[partId]);
                        delete result[partId];
                        somethingChanged = true;
                        }
                    });   

                    delete includes[containerId];
                    }
                }

                if(!somethingChanged) {
                    console.error("Circular dependency detected in parts rendering", includes);
                    break;
                }
            }   

            super._replaceHTML(result, content, options);
        }
    }
    
    return BaseSheetClass;
}