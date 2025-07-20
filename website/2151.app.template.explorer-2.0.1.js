
$(function()
{
    app =
    {
        controller: entityos._util.controller.code,
        vq: entityos._util.view.queue,
        get: entityos._util.data.get,
        set: entityos._util.data.set,
        invoke: entityos._util.controller.invoke,
        add: entityos._util.controller.add,
        show: entityos._util.view.queue.show
    };

	_.mixin(
	{
		VERSION: entityos._scope.app.options.version,
		isNotSet: entityos._util.isNotSet,
		isSet: entityos._util.isSet
	});

    entityos._util.factory.export();
    entityos._util.controller.invoke('explorer-templates-init');
    entityos._util.controller.invoke('explorer-init');
});

entityos._util.controller.add(
{
    name: 'explorer-init',
    code: function ()
    {
       var uriContext = window.location.pathname;

       if (uriContext != '/template-explorer' && uriContext != '/next')
       {
            var uriContextData = _.replace(uriContext, '/template-explorer/', '');

            if (uriContextData != '')
            {
                if (_.contains(uriContextData, 'type:'))
                {
                    var searchTypeName = _.replace(uriContextData, 'type:', '');
                    app.set({scope: 'explorer-templates', context: 'type', value: searchTypeName});
                    app.set({scope: 'explorer-templates', context: '_type', value: searchTypeName});
                }
				else if (_.contains(uriContextData, 'domain:'))
                {
                    var searchDomainName = _.replace(uriContextData, 'domain:', '');
                    searchDomainName = _.replace(searchDomainName, '-', ' ');
                    app.set({scope: 'explorer-templates', context: 'domain', value: searchDomainName});
                    app.set({scope: 'explorer-templates', context: '_domain', value: searchDomainName});
                }
                else
                {
                    $('#explorer-templates-search-text').val(uriContextData);
                    app.set({scope: 'explorer-templates', context: 'search-text', value: uriContextData});
                }
            }
       }
    }
});

entityos._util.controller.add(
{
    name: 'explorer-templates-init',
    code: function ()
    {
		//'/site/6b2beaea-f5ef-45f7-bec0-4c679d314d71/data/skillzeb.templates.types-1.0.0.json',

        $.ajax(
        {
            type: 'GET',
            url: 'https://raw.githubusercontent.com/selfdriven-foundation/skillzeb/refs/heads/main/schemas/skillzeb.templates.types-2.0.0.json',
			cors: false,
			cache: false,
            dataType: 'json',
            success: function(data)
            {
                var templatesTypesView = app.vq.init({queue: 'templates-types-view'});

                var types = data.skillzeb.templates.types;
                types = _.sortBy(types, 'caption');

                app.set({scope: 'explorer-templates', context: 'templates-types', value: types});

                var searchTypeName = app.get({scope: 'explorer-templates', context: 'type'});

                if (_.isSet(searchTypeName))
                {
                     $('input[data-id="' + searchTypeName + '"]').attr('checked', 'checked')
                }  
           
                templatesTypesView.add([
                    '<div class="row border-bottom border-gray-300 pb-2 mb-1">',
                    '<div class="col-12 text-muted small mb-1">Leave unticked for all.</div>',
                    '</div>'
                ]);

                _.each(types, function (type)
                {
                    var checked = (type.name == searchTypeName?' checked="checked"':'');

                    templatesTypesView.add(
                    [
                        '<div class="row mt-2">',
                        '<div class="col-2 text-center"><input type="checkbox" class="entityos-check" data-scope="explorer-templates" data-context="type" data-id="', type.code, '" data-name="', _.kebabCase(type.name), '" data-code="', type.code, '"', checked, '></div>',
                        '<div class="col-10">', type.name, '</div>',
                        '</div>'
                    ]);
                    
                });

                templatesTypesView.render('#explorer-templates-search-type');

                entityos._util.controller.invoke('explorer-templates-search');
            },
            error: function (data) {}			
        });

		$.ajax(
        {
            type: 'GET',
            url: '/site/1401d861-0e78-4f33-b507-16e0aff64d32/data/skillzeb.levels-1.0.0.json',
			cors: false,
			cache: false,
            dataType: 'json',
            success: function(data)
            {
				var templatesLevelsView = app.vq.init({queue: 'templates-levels-view'});

                var levels = data.skillzeb.skills.levels;
                //types = _.sortBy(types, 'caption');

                app.set({scope: 'explorer-templates', context: 'templates-levels', value: levels});

                templatesLevelsView.add([
                    '<div class="row border-bottom border-gray-300 pb-2 mb-1">',
                    '<div class="col-12 text-muted small mb-1">Leave unticked for all.</div>',
                    '</div>'
                ]);

				const searchLevelName = app.get({scope: 'explorer-templates', context: 'level'});

                _.each(levels, function (level)
                {
					level._name = '<div>' + level.name + '</div>'; //_.replace(level.name, 'Level ', '')

					if (_.first(level.notes.usage) != '')
                    {
                        level._name = level._name + '<div class="text-wrap text-muted small">' + _.first(level.notes.usage) + '</div>';
                    }

                    level._checked = (level.name == searchLevelName?' checked="checked"':'');

                    templatesLevelsView.add(
                    [
                        '<div class="row mt-2">',
                        '<div class="col-2 text-center"><input type="checkbox" class="entityos-check" data-scope="explorer-templates" data-context="level" data-id="', level.code, '" data-name="', _.kebabCase(level.name), '" data-code="', level.code, '"', level._checked, '></div>',
                        '<div class="col-10">', level._name, '</div>',
                        '</div>'
                    ]);
                    
                });

                templatesLevelsView.render('#explorer-templates-search-level');
            },
            error: function (data) {}			
        });

		$.ajax(
        {
            type: 'GET',
            url: '/site/2098/selfdriven-skills-domains.json',
			cors: false,
			cache: false,
            dataType: 'json',
            success: function(data)
            {
                var templatesDomainsView = app.vq.init({queue: 'templates-domains-view'});

                var domains = data.selfdriven.skills.domains;
                domains = _.sortBy(domains, 'name');

                app.set({scope: 'explorer-templates', context: 'templates-domains', value: domains});

                var searchDomainName = app.get({scope: 'explorer-templates', context: 'domain'});

                if (_.isSet(searchDomainName))
                {
                     $('input[data-id="' + searchDomainName + '"]').attr('checked', 'checked')
                }  

                var domain =
                {
                    human: _.find(domains, function (domain) {return domain.code == '00'}),
                    whoAmI: _.find(domains, function (domain) {return domain.code == '01'})
                }
               
                templatesDomainsView.add([
                    '<div class="row border-bottom border-gray-300 pb-2 mb-1">',
                    '<div class="col-12 text-muted small mb-1">Leave unticked for all.</div>',
                    '</div>'
                ]);

                var checked = (domain.human.name == searchDomainName?' checked="checked':'');

                templatesDomainsView.add(
                [
                    '<div class="row pt-2">',
                        '<div class="col-2 text-center"><input type="checkbox" class="entityos-check" data-scope="explorer-skills" data-context="domain" data-id="', domain.human.name, '" " data-name="', _.kebabCase(domain.human.name), '" data-code="', domain.human.code, '"', checked, '"></div>',
                        '<div class="col-10">', 
                            '<div>', domain.human.name, ' <a href="#info" class="text-muted small" data-toggle="collapse"><i class="fe fe-info small"></i></a></div>',
                            '<div class="collapse text-secondary small" id="info">',
                                '<div>Uniquely Human Skills</div>',
                                '<div class="pt-1 pb-0">',
                                    '<a href="/site/2098/selfdriven-skills-uniquely-human-dark.png" target="_blank">',
                                        '<img src="/site/2098/selfdriven-skills-uniquely-human-dark.png"',
                                        ' class="border rounded img-responsive w-100 mx-auto"></a>',
                                '</div>',
                                '<div class="pt-1 pb-2">',
                                    '<a href="https://selfdriven.ai/research" target="_blank" class="text-muted small">',
                                        'selfdriven.ai/research',
                                    '</a>',
                                '</div>',
                            '</div>',
                         '</div>',
                    '</div>'
                ]);

                var checked = (domain.whoAmI.name == searchDomainName?' checked="checked':'');

                templatesDomainsView.add(
                [
                    '<div class="row border-bottom border-gray-300 pb-2 mb-2">',
                    '<div class="col-2 text-center"><input type="checkbox" class="entityos-check" data-scope="explorer-templates" data-context="domain" data-code="', domain.whoAmI.code, '" data-id="', domain.whoAmI.name, '" data-name="', _.kebabCase(domain.whoAmI.name), '"', checked, '"></div>',
                    '<div class="col-10">', domain.whoAmI.name, '</div>',
                    '</div>'
                ]);

                _.each(domains, function (domain)
                {
                    if (domain.code != '00' && domain.code != '01')
                    {
                        var checked = (domain.name == searchDomainName?'checked':'');

                        templatesDomainsView.add(
                        [
                            '<div class="row">',
                            '<div class="col-2 text-center"><input type="checkbox" class="entityos-check" data-scope="explorer-templates" data-context="domain" data-id="', domain.name, '" data-name="', _.kebabCase(domain.name), '" data-code="', domain.code, '"', checked, '"></div>',
                            '<div class="col-10">', domain.name, '</div>',
                            '</div>'
                        ]);
                    }
                });

                templatesDomainsView.render('#explorer-templates-search-domain');
            },
            error: function (data) {}			
        });

    }
});

entityos._util.controller.add(
{
    name: 'explorer-templates',
    code: function ()
    {}
});

entityos._util.controller.add(
{
    name: 'explorer-templates-search',
    code: function ()
    {
        var templatesSet = app.get({scope: 'explorer-templates', context: 'templates-set'});

        if (templatesSet != undefined)
        {
            app.invoke('explorer-templates-search-process');
        }
        else
        {
            app.show('#explorer-templates-search-view', '<h3 class="text-muted text-center mt-6">Initialising templates set ...</h3>');
            $.ajax(
            {
                type: 'GET',
                url: 'https://raw.githubusercontent.com/selfdriven-foundation/skillzeb/refs/heads/main/indexes/skillzeb.templates.index-latest.json',
				cors: false,
				cache: false,
                dataType: 'json',
				cors: false,
				cache: false,
                success: function(data)
                {
                    app.set({scope: 'explorer-templates', context: 'templates-set', value: data.skillzeb.templates.set});
                    app.invoke('explorer-templates-search-process');
                },
                error: function (data) {}			
            });
        }
    }
});
           
entityos._util.controller.add(
{
    name: 'explorer-templates-search-process',
    code: function ()
    {
        var search = app.get({scope: 'explorer-templates', valueDefault: {}});

        var templatesSet = app.get({scope: 'explorer-templates', context: 'templates-set'});

        if (!_.isEmpty(search._type))
        {
            templatesSet = _.filter(templatesSet, function (template)
            {
                return _.includes(search._type, template.type)
            });
        } 

		if (!_.isEmpty(search._level))
        {
            templatesSet = _.filter(templatesSet, function (template)
            {
				template.matched = _.includes(template.levels, '*');
				if (!template.matched)
				{
                	template.matched = (_.difference(search._level, template.levels).length == 0)
				}
				return template.matched;
            });
        } 

        if (search['search-text'] != '' && search['search-text'] != undefined)
        {
            var searchText = search['search-text'].toLowerCase();

            templatesSet = _.filter(templatesSet, function (template)
            {
                return  (_.includes(_.get(template, 'sdt', '').toLowerCase(), searchText)
                            || _.includes(_.get(template, 'title', '').toLowerCase(), searchText)
                            || _.includes(_.get(template, 'name', '').toLowerCase(), searchText)
                            || _.includes(_.get(template, 'summary', '').toLowerCase(), searchText)
                            || _.includes(_.get(template, 'url', '').toLowerCase(), searchText)
                        )
            });
        } 

        if (!_.isEmpty(search._domain))
        {
            templatesSet = _.filter(templatesSet, function (template)
            {
				template.matched = _.includes(template.domains, '*');
				if (!template.matched)
				{
                	template.matched = (_.difference(search._domain, template.domains).length == 0)
				}
				return template.matched;
            });
        } 

		if (!_.isEmpty(search.experience))
        {
			if (_.includes(search.experience, 'starter'))
			{
				templatesSet = _.filter(templatesSet, function (template)
				{
					return  (_.includes(template.title.toLowerCase(), 'starter')
								|| _.includes(template.name.toLowerCase(), 'starter'))
				});
			}

			if (_.includes(search.experience, 'resources'))
			{
				templatesSet = _.filter(templatesSet, function (template)
				{
					return  (_.includes(template.title.toLowerCase(), 'resources')
								|| _.includes(template.name.toLowerCase(), 'resources'))
				});
			}
        } 

        var templatesView = app.vq.init({queue: 'templates-view'});

        app.set({scope: 'explorer-templates', context: 'templates-set-searched', value: templatesSet});

        if (templatesSet.length == 0)
        {
            templatesView.add('<h3 class="text-muted text-center mt-6">There are no templates that match this search.</h3>');
        }
        else
        {
            var templatesCountText = 'There are ' + templatesSet.length + ' templates that match this search.';
            if (templatesSet.length == 1)
            {
                templatesCountText = 'There is one template that matches this search.';
            }

            templatesView.add(
            [
                '<div class="row mx-auto" style="width:90%;">',
                    '<div class="col-9 text-muted"><div class="mt-2 text-center">', templatesCountText, '</div></div>',
                    '<div class="col-3 text-center">',
                        '<button class="btn btn-sm btn-primary-outline shadow entityos-click" data-controller="explorer-templates-export">',
                            '<i class="fe fe-download-cloud"></i>',
                        '</button>',
                    '</div>',
                '</div>'
            ]);

            templatesView.add(['<div class="card mt-4 shadow-lg"><div class="card-body pt-0">']);

            templatesSet = _.sortBy(templatesSet, function (template) {return _.get(template, 'title', '').toLowerCase()});

            var templateTypes = app.get({scope: 'explorer-templates', context: 'templates-types'});
            var limitReached = false;

            _.each(templatesSet, function (template, t)
            {
                if (t > 149)
                {
                    if (!limitReached)
                    {
                        limitReached = true;
                        skillsView.add(
                        [
                            '<div class="text-center">',
                                '<h3 class="text-muted mt-6 mb-4">First 150 of ', templatesSet.length, ' templates shown.</h3>',
                                '<button class="btn btn-sm btn-primary-outline shadow lift entityos-click" data-controller="explorer-templates-export">',
                                    'Download All <i class="fe fe-download-cloud"></i>',
                                '</button>',
                            '</div>'
                        ]);
                    }
                }
                else
                {
                    //skill._onchainassetname = _.replaceAll(skill.sdi, '-', '');

                    var _type = _.find(templateTypes, function (templateType)
                    {
                        return templateType.code == template.type
                    });

                    if (_type != undefined)
                    {
                       template.typeText = _type.name
                    }

					template._url = template.url;
					if (!_.includes(template._url, 'http'))
					{
						if (!_.startsWith(template._url, '/'))
						{
							template._url = '/' + template._url;
						}

						template._url = '/site/6b2beaea-f5ef-45f7-bec0-4c679d314d71/data' + template._url;
					}

                    template._filename = template.name + '.template.json';
					
                    var htmlJSONLink = '<div class="text-muted small">File</div>' +
						'<a class="text-dark" href="' + template._url + '" target="_blank"><i class="fe fe-external-link"></i></a>' + 
						' <a class="entityos-click text-dark" data-url="' + template._url + '"' +
						' data-filename="' + template._filename + '"' +
						' data-controller="explorer-template-download"><i class="fe fe-download-cloud text-dark"></i></a>';

					htmlJSONLink += '<div class="text-muted small mt-2">Share</div>' +
						' <div><a class="entityos-click text-dark" data-name="' + template.name + '"' +
						' data-controller="explorer-template-share"><i class="fe fe-copy text-dark"></i></a></div>' +
						'<div id="explorer-template-share-view-' + template.name + '" class="small text-secondary"></div>';

                    var htmlViewInfo = '<a class="btn btn-primary btn-sm py-1 btn-pill entityos-click entityos-collapse" data-toggle="collapse" href="#explorer-template-info-view-' + template.name + '">View</a>';

                    templatesView.add(
                    [
                        '<div class="row pt-5 pb-3 border-bottom border-gray-300">',
                            '<div class="col-12 col-md-9 mb-0 mt-2"><h2 class="mb-2 fw-bold" style="font-size: 1.8rem; color:#1b2a4e;">', template.title, '</h2><div class="text-dark">', template.summary, '</div><div class="mt-3 mb-2">', htmlViewInfo, '</div></div>',
                             '<div class="col-12 col-md-3 mb-2 border-left border-gray-300"><div class="text-muted small">Type</div><div>', template.typeText, '</div>',
                             '<div class="mt-2">', htmlJSONLink, '</div>',
                             '</div>',
                            
                            '<div class="col-12 mb-2 border border-mute mt-2 shadow rounded collapse entityos-collapse" id="explorer-template-info-view-', template.name, '" data-controller="explorer-template-info-show" data-context="' + template.name + '" data-url="' + template.url + '"></div>'
                    ]);

                    templatesView.add('</div>')
                }
            });

            templatesView.add(['</div></div>']);
        }

        templatesView.render('#explorer-templates-search-view');
    }
});

entityos._util.controller.add(
{
    name: 'explorer-templates-export',
    code: function ()
    {
        app.invoke('util-export-data-as-is-to-csv',
        {
            scope: 'explorer-templates',
            context: 'templates-set-searched',
            filename: 'selfdriven-templates.csv'
        });
    }
});

entityos._util.controller.add(
{
	name: 'explorer-template-info-show',
	code: function (param, response)
	{
        if (param.status == 'shown')
        {
            var template = entityos._util.data.set(
            {
                scope: 'explorer-template-info',
                context: 'template',
                value: param.dataContext
            });

			template._url = template.url;
			if (!_.includes(template._url, 'http'))
			{
				if (!_.startsWith(template._url, '/'))
				{
					template._url = '/' + template._url;
				}

				template._url = '/site/6b2beaea-f5ef-45f7-bec0-4c679d314d71/data' + template._url;
			}
					
            $.ajax(
            {
                type: 'GET',
                url: template._url,
				cors: false,
				cache: false,
                dataType: 'json',
                success: function(data)
                {
                    entityos._util.data.set(
                    {
                        scope: 'explorer-template-info',
                        context: 'template-data',
                        value: data
                    });

                    app.invoke('explorer-template-info-render', 
                    {
                        containerSelector: '#explorer-template-info-view-' + template.context
                    });
                }
            });
		}
	}
});

entityos._util.controller.add(
{
	name: 'explorer-template-info-render',
	code: function (param, response)
	{
		var containerSelector = entityos._util.param.get(param, 'containerSelector').value;
		
		var templateData = entityos._util.data.get(
        {
            scope: 'explorer-template-info',
            context: 'template-data'
        });

		var informationView = app.vq.init({queue: 'explorer-template-info-show'});

		if (templateData == undefined)
		{
			informationView.add(
			[
				'<div class="card mt-2">',
					'<div class="card-body">',
						'<div class="text-secondary">No project template information.</div>',
					'</div>',
				'</div>'
			]);

			informationView.render(containerSelector);
		}
		else
		{
            var userRole = 'learner' // 'learning-partner';

			if (_.has(templateData, 'template'))
			{
				var type = _.first(_.keys(templateData.template));

				entityos._util.data.set(
				{
					scope: 'explorer-template-info',
					context: 'template-data-type',
					value: type
				});

				var projectTemplate = templateData.template[type];

				var templateTitle = projectTemplate.title;
				if (templateTitle == undefined) {templateTitle = projectTemplate.description}

				var templateSummary = '';
				if (projectTemplate.summary != templateTitle)
				{
					templateSummary = '<div class="text-left text-secondary">' + projectTemplate.summary + '</div>';
				}

				informationView.add(
				[
					'<div class="x-card mt-4">',
						'<div class="x-card-body">',
							'<h2 class="text-left fw-bold mb-0">', templateTitle, '</h2>',
							templateSummary,
						'</div>',
					'</div>'
				]);

				// OUTCOMES

				if (_.has(projectTemplate, 'outcomes'))
				{
					informationView.add(
					[
						'<div class="card mt-1">',
							'<div class="card-header px-0">',
								'<div class="row align-items-end">',
									'<div class="col">',
										'<h3 class="mb-0" style="font-size:1.2rem;"><a class="ml-1 mr-1 myds-collapse-toggle text-dark" data-toggle="collapse" role="button" href="#util-project-information-', projectTemplate.name, '-outcomes-collapse"',
										' data-related-selector="#util-project-information-', projectTemplate.name, '-outcomes-collapse-container">',
										'Outcomes</a></h3>',
									'</div>',
									'<div class="col-auto pb-1">',
										'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#util-project-information-', projectTemplate.name, '-outcomes-collapse"',
											' id="util-project-information-', projectTemplate.name, '-outcomes-collapse-container">',
											'<i class="fe fe-chevron-down text-muted ml-2 mt-2"></i>',
										'</a>',
									'</div>',
								'</div>',
							'</div>',
							'<div class="card-body p-0 collapse myds-collapse" id="util-project-information-', projectTemplate.name, '-outcomes-collapse">'
					]);

					_.each(projectTemplate.outcomes, function (outcome)
					{
						informationView.add(
						[
							'<div class="card">',
								'<div class="card-body pb-0">',
									outcome.description,
								'</div>',
							'</div>'
						]);
					});

					informationView.add(
					[		
							'</div>',
						'</div>'
					]);
				}

				// CONTRACTS

				if (_.has(projectTemplate, 'contracts'))
				{
					informationView.add(
					[
						'<div class="card mt-1">',
							'<div class="card-header px-0">',
								'<div class="row align-items-end">',
									'<div class="col">',
										'<h3 class="mb-0" style="font-size:1.2rem;"><a class="ml-1 mr-1 myds-collapse-toggle text-dark" data-toggle="collapse" role="button" href="#util-project-information-', projectTemplate.name, '-contacts-collapse"',
										' data-related-selector="#util-project-information-', projectTemplate.name, '-contacts-collapse-container">',
										'Contracts</a></h3>',
									'</div>',
									'<div class="col-auto pb-1">',
										'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#util-project-information-', projectTemplate.name, '-contacts-collapse"',
											' id="util-project-information-', projectTemplate.name, '-contacts-collapse-container">',
											'<i class="fe fe-chevron-down text-muted ml-2 mt-2"></i>',
										'</a>',
									'</div>',
								'</div>',
							'</div>',
							'<div class="card-body p-0 collapse myds-collapse" id="util-project-information-', projectTemplate.name, '-contacts-collapse">'
					]);

					_.each(projectTemplate.contracts, function (contract)
					{
						if (contract.description == undefined) {contract.description = ''};
						if (_.isArray(contract.description)) {contract.description = _.join(contract.description, '')}

						if (_.isSet(contract.description))
						{
							contract._description = '<div class="mt-2 text-secondary">' + contract.description + '</div>';
						}

						contract._core = (contract.core == 'true'?' (Core)':'');
						
						if (_.isSet(contract.url))
						{
							if (_.isNotSet(contract.name)) { contract.name = _.replace(contract.url, 'https://', '') };

							informationView.add(
							[
								'<div class="card">',
									'<div class="card-body">',
										'<h3 class="fw-bold mb-0">', _.capitalize(contract.type), contract._core, '</h3>',
										'<div><a href="', contract.url, '" target="_blank">', contract.name, '</a></div>',
										contract._description,
									'</div>',
								'</div>'
							]);
						}
						else if (_.isSet(contract.description))
						{
							informationView.add(
							[
								'<div class="card">',
									'<div class="card-body">',
										'<h3 class="fw-bold mb-0">', _.capitalize(contract.type), contract._core, '</h3>',
										contract._description,
									'</div>',
								'</div>'
							]);
						}
					});

					informationView.add(
					[		
							'</div>',
						'</div>'
					]);
				}

				// SPACES

				if (_.has(projectTemplate, 'spaces'))
				{
					informationView.add(
					[
						'<div class="card mt-1">',
							'<div class="card-header px-0">',
								'<div class="row align-items-end">',
									'<div class="col">',
										'<h3 class="mb-0" style="font-size:1.2rem;"><a class="ml-1 mr-1 myds-collapse-toggle text-dark" data-toggle="collapse" role="button" href="#util-project-information-', projectTemplate.name, '-spaces-collapse"',
										' data-related-selector="#util-project-information-', projectTemplate.name, '-spaces-collapse-container">',
										'Spaces</a></h3>',
									'</div>',
									'<div class="col-auto pb-1">',
										'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#util-project-information-', projectTemplate.name, '-spaces-collapse"',
											' id="util-project-information-', projectTemplate.name, '-spaces-collapse-container">',
											'<i class="fe fe-chevron-down text-muted ml-2 mt-2"></i>',
										'</a>',
									'</div>',
								'</div>',
							'</div>',
							'<div class="card-body p-0 collapse myds-collapse" id="util-project-information-', projectTemplate.name, '-spaces-collapse">'
					]);

					_.each(projectTemplate.spaces.virtual, function (space)
					{
						informationView.add(
						[
							'<div class="card">',
								'<div class="card-body">',
									'<h3 class="fw-bold mb-0">', space.caption, ' (Virtual)</h3>',
									'<div class="text-secondary">', space.name, '</div>',
								'</div>',
							'</div>'
						]);
					});

					_.each(projectTemplate.spaces.physical, function (space)
					{
						informationView.add(
						[
							'<div class="card">',
								'<div class="card-body">',
									'<h3 class="fw-bold mb-0">', space.caption, ' (Physical)</h3>',
									'<div class="text-secondary">', space.name, '</div>',
								'</div>',
							'</div>'
						]);
					});

                    _.each(projectTemplate.spaces.composed, function (space)
					{
						informationView.add(
						[
							'<div class="card">',
								'<div class="card-body">',
									'<h3 class="fw-bold mb-0">', space.caption, ' (Composed)</h3>',
									'<div class="text-secondary">', space.name, '</div>',
                                    (space.url==undefined?'':'<a href="' + space.url + '" target="_blank">View <i class="fe fe-external-link"></i>'),
								'</div>',
							'</div>'
						]);
					});
			
					informationView.add(
					[		
							'</div>',
						'</div>'
					]);
				}

				// GOVERNANCE | STRUCTURE TYPES

				if (_.has(projectTemplate, 'governance'))
				{

					informationView.add(
					[
						'<div class="card mt-1">',
							'<div class="card-header px-0">',
								'<div class="row align-items-end">',
									'<div class="col">',
										'<h3 class="mb-0" style="font-size:1.2rem;"><a class="ml-1 mr-1 myds-collapse-toggle text-dark" data-toggle="collapse" role="button" href="#util-project-information-', projectTemplate.name, '-governance-collapse"',
										' data-related-selector="#util-project-information-', projectTemplate.name, '-governance-collapse-container">',
										'Governance</a></h3>',
									'</div>',
									'<div class="col-auto pb-1">',
										'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#util-project-information-', projectTemplate.name, '-governance-collapse"',
											' id="util-project-information-', projectTemplate.name, '-governance-collapse-container">',
											'<i class="fe fe-chevron-down text-muted ml-2 mt-2"></i>',
										'</a>',
									'</div>',
								'</div>',
							'</div>',
							'<div class="card-body p-0 collapse myds-collapse" id="util-project-information-', projectTemplate.name, '-governance-collapse">'
					]);

					if (_.has(projectTemplate, 'governance.structure-types'))
					{
						informationView.add(
						[
							'<div class="card mt-1">',
								'<div class="card-header px-2">',
									'<div class="row align-items-end">',
										'<div class="col">',
											'<h3 class="mb-0" style="font-size:1.2rem;"><a class="ml-1 mr-1 myds-collapse-toggle text-dark" data-toggle="collapse" role="button" href="#util-project-information-', projectTemplate.name, '-governance-structure-types-collapse"',
											' data-related-selector="#util-project-information-', projectTemplate.name, '-governance-structure-types-collapse-container">',
											'Structure Types</a></h3>',
										'</div>',
										'<div class="col-auto pb-1">',
											'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#util-project-information-', projectTemplate.name, '-governance-structure-types-collapse"',
												' id="util-project-information-', projectTemplate.name, '-governance-structure-types-collapse-container">',
												'<i class="fe fe-chevron-down text-muted ml-2 mt-2"></i>',
											'</a>',
										'</div>',
									'</div>',
								'</div>',
								'<div class="card-body p-0 collapse myds-collapse" id="util-project-information-', projectTemplate.name, '-governance-structure-types-collapse">'
						]);

						_.each(projectTemplate.governance['structure-types'], function (structureType)
						{
								informationView.add(
								[
									'<div class="card">',
										'<div class="card-body">',
											'<h3 class="fw-bold mb-0">', structureType.title, '</h3>',
											'<div class="text-secondary">', structureType.name, '</div>',
										'</div>',
									'</div>'
								]);
						});

						informationView.add(
						[		
								'</div>',
							'</div>'
						]);
					}
					
					// GOVERNANCE | STRUCTURES

					if (_.has(projectTemplate, 'governance.structures'))
					{
						informationView.add(
						[
							'<div class="card mt-1">',
								'<div class="card-header px-2">',
									'<div class="row align-items-end">',
										'<div class="col">',
											'<h3 class="mb-0" style="font-size:1.2rem;"><a class="ml-1 mr-1 myds-collapse-toggle text-dark" data-toggle="collapse" role="button" href="#util-project-information-', projectTemplate.name, '-governance-structures-collapse"',
											' data-related-selector="#util-project-information-', projectTemplate.name, '-governance-structures-collapse-container">',
											'Structures</a></h3>',
										'</div>',
										'<div class="col-auto pb-1">',
											'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#util-project-information-', projectTemplate.name, '-governance-structures-collapse"',
												' id="util-project-information-', projectTemplate.name, '-governance-structures-collapse-container">',
												'<i class="fe fe-chevron-down text-muted ml-2 mt-2"></i>',
											'</a>',
										'</div>',
									'</div>',
								'</div>',
								'<div class="card-body p-0 collapse myds-collapse" id="util-project-information-', projectTemplate.name, '-governance-structures-collapse">'
						]);

						_.each(projectTemplate.governance['structures'], function (structure)
						{
								informationView.add(
								[
									'<div class="card">',
										'<div class="card-body">',
											'<h3 class="fw-bold mb-0">', structure.title, '</h3>',
											'<div class="text-secondary">', structure.name, '</div>',
											'<div class="fw-bold mt-2 mb-0">Type</div>',
											'<div class="text-secondary">', structure.type, '</div>',
										'</div>',
									'</div>'
								]);
						});

						informationView.add(
						[		
								'</div>',
							'</div>'
						]);
					}

					// GOVERNANCE | RULES

					if (_.has(projectTemplate, 'governance.rules'))
					{
						informationView.add(
						[
							'<div class="card mt-1">',
								'<div class="card-header px-2">',
									'<div class="row align-items-end">',
										'<div class="col">',
											'<h3 class="mb-0" style="font-size:1.2rem;"><a class="ml-1 mr-1 myds-collapse-toggle text-dark" data-toggle="collapse" role="button" href="#util-project-information-', projectTemplate.name, '-governance-rules-collapse"',
											' data-related-selector="#util-project-information-', projectTemplate.name, '-governance-rules-collapse-container">',
											'Rules</a></h3>',
										'</div>',
										'<div class="col-auto pb-1">',
											'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#util-project-information-', projectTemplate.name, '-governance-rules-collapse"',
												' id="util-project-information-', projectTemplate.name, '-governance-rules-collapse-container">',
												'<i class="fe fe-chevron-down text-muted ml-2 mt-2"></i>',
											'</a>',
										'</div>',
									'</div>',
								'</div>',
								'<div class="card-body p-0 collapse myds-collapse" id="util-project-information-', projectTemplate.name, '-governance-rules-collapse">'
						]);

						_.each(projectTemplate.governance.rules, function (rule, ruleIndex)
						{
							if (_.isArray(rule.description))
							{
								rule.description = _.join(rule.description, '');
							}

							if (_.isNotSet(rule.subject))
							{
								rule.subject = 'Rule #' + (ruleIndex + 1)
							}

							informationView.add(
							[
								'<div class="card">',
									'<div class="card-body pb-0">',
										(_.isSet(rule.subject)?'<h3 class="fw-bold">' + rule.subject + '</h3>':''),
										rule.description
							]);

								if (_.has(rule, 'actions'))
								{
									informationView.add(
									[
										'<div class="fw-bold mt-3 mb-0">Actions</div>',
										_.join(_.map(rule['actions'], function (action) {return '<div class="text-secondary">' + action + '</div>'}), ''),
									]);
								}

								if (_.has(rule, 'skills'))
								{
									informationView.add(
									[
										'<div class="fw-bold mt-3 mb-0">Skills</div>',
										_.join(_.map(rule['skills'], function (skill) {return '<div class="text-secondary">' + skill.name + ' ("' + skill.type + '")</div>'}), ''),
									]);
								}

								if (_.has(rule, 'token.name'))
								{
									informationView.add(
									[
										'<div class="fw-bold mt-3 mb-0">Token</div>',
										'<div class="text-secondary">' + rule.token.name + '</div>',
									]);
								}

								if (_.has(rule, 'multiplier'))
								{
									informationView.add(
									[
										'<div class="fw-bold mt-3 mb-0">Token Multiplier</div>',
										'<div class="text-secondary">' + rule.multiplier + '</div>',
									]);
								}

								if (_.has(rule, 'minimum-percentage-of-total'))
								{
									informationView.add(
									[
										'<div class="fw-bold mt-3 mb-0">Minimum % of Total</div>',
										'<div class="text-secondary">' + rule['minimum-percentage-of-total'] + '%</div>',
									]);
								}

							informationView.add(
							[
									'</div>',
								'</div>'
							]);
						});

						informationView.add(
						[		
								'</div>',
							'</div>'
						]);
					}

					// GOVERNANCE |  RESOURCES

					if (_.has(projectTemplate, 'governance.resources'))
					{
						informationView.add(
						[
							'<div class="card mt-1">',
								'<div class="card-header px-2">',
									'<div class="row align-items-end">',
										'<div class="col">',
											'<h3 class="mb-0" style="font-size:1.2rem;"><a class="ml-1 mr-1 myds-collapse-toggle text-dark" data-toggle="collapse" role="button" href="#util-project-information-', projectTemplate.name, '-governance-resources-collapse"',
											' data-related-selector="#util-project-information-', projectTemplate.name, '-governance-resources-collapse-container">',
											'Resources</a></h3>',
										'</div>',
										'<div class="col-auto pb-1">',
											'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#util-project-information-', projectTemplate.name, '-governance-resources-collapse"',
												' id="util-project-information-', projectTemplate.name, '-governance-resources-collapse-container">',
												'<i class="fe fe-chevron-down text-muted ml-2 mt-2"></i>',
											'</a>',
										'</div>',
									'</div>',
								'</div>',
								'<div class="card-body p-0 collapse myds-collapse" id="util-project-information-', projectTemplate.name, '-governance-resources-collapse">'
						]);

						_.each(projectTemplate.governance.resources, function (resource)
						{
							if (resource.description == undefined) {resource.description = ''};
							if (_.isArray(resource.description)) {resource.description = _.join(resource.description, '')}

							if (_.isSet(resource.url))
							{
								informationView.add(
								[
									'<div class="card">',
										'<div class="card-body">',
											'<div class="fw-bold mt-3 mb-0">', resource.type, '</div>',
											'<div><a href="', resource.url, '" target="_blank">', resource.name, '</a></div>',
										'</div>',
									'</div>'
								]);
							}
							else if (_.isSet(resource['image-url']))
							{
								informationView.add(
								[
									'<div class="card">',
										'<div class="card-body">',
											'<div class="row align-items-end">',
												'<div class="col">',
													'<h4>', resource.subject, '</h4>',
												'</div>',
												'<div class="col-auto pb-1">',
													'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#util-project-information-governance-resource-', _.kebabCase(resource.subject), '-collapse">',
														'<i class="fe fe-chevron-down text-muted ml-2 mt-2"></i>',
													'</a>',
												'</div>',
											'</div>',							
										'</div>',
										'<div class="p-4 pt-0 collapse myds-collapse" id="util-project-information-governance-resource-', _.kebabCase(resource.subject), '-collapse"',
											' data-subject="', resource.subject, '">',
											'<div id="util-project-information-governance-resource-', _.kebabCase(resource.subject), '">',
												'<div class="text-secondary">', resource.description, '</div>',
												'<img src="', resource['image-url'], '" class="img-responsive w-100">',
											'</div>',
										'</div>',
									'</div>'
								]);
							}
							else if (_.isSet(resource.description))
							{
								informationView.add(
								[
									'<div class="card">',
										'<div class="card-body">',
											'<h4>', resource.subject, '</h4>',
											'<div class="text-secondary">', resource.description, '</div>',
										'</div>',
									'</div>'
								]);
							}
						});

						informationView.add(
						[		
								'</div>',
							'</div>'
						]);
					}

					// GOVERNANCE | TEAM

					if (_.has(projectTemplate, 'governance.team'))
					{
						informationView.add(
						[
							'<div class="card mt-1">',
								'<div class="card-header px-2">',
									'<div class="row align-items-end">',
										'<div class="col">',
											'<h3 class="mb-0" style="font-size:1.2rem;"><a class="ml-1 mr-1 myds-collapse-toggle text-dark" data-toggle="collapse" role="button" href="#util-project-information-', projectTemplate.name, '-governance-team-collapse"',
											' data-related-selector="#util-project-information-', projectTemplate.name, '-governance-team-collapse-container">',
											'Team</a></h3>',
										'</div>',
										'<div class="col-auto pb-1">',
											'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#util-project-information-', projectTemplate.name, '-governance-team-collapse"',
												' id="util-project-information-', projectTemplate.name, '-governance-team-collapse-container">',
												'<i class="fe fe-chevron-down text-muted ml-2 mt-2"></i>',
											'</a>',
										'</div>',
									'</div>',
								'</div>',
								'<div class="card-body p-0 collapse myds-collapse" id="util-project-information-', projectTemplate.name, '-governance-team-collapse">'
						]);

						_.each(projectTemplate.governance['team'], function (team)
						{
								informationView.add(
								[
									'<div class="card">',
										'<div class="card-body">',
											'<h3 class="fw-bold mb-0">', _.capitalize(team.role), '</h3>',
											'<div class="fw-bold mt-2 mb-0">Entity Type</div>',
											'<div class="text-secondary">', team['entity-type'], '</div>',
										'</div>',
									'</div>'
								]);
						});

						informationView.add(
						[		
								'</div>',
							'</div>'
						]);
					}

					// GOVERNANCE | DECISIONS (TOKENOMICS)

					if (_.has(projectTemplate, 'governance.tokenomics'))
					{
						informationView.add(
						[
							'<div class="card mt-1">',
								'<div class="card-header px-2">',
									'<div class="row align-items-end">',
										'<div class="col">',
											'<h3 class="mb-0" style="font-size:1.2rem;"><a class="ml-1 mr-1 myds-collapse-toggle text-dark" data-toggle="collapse" role="button" href="#util-project-information-', projectTemplate.name, '-governance-decisions-collapse"',
											' data-related-selector="#util-project-information-', projectTemplate.name, '-governance-decisions-collapse-container">',
											'Tokenomics</a></h3>',
										'</div>',
										'<div class="col-auto pb-1">',
											'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#util-project-information-', projectTemplate.name, '-governance-decisions-collapse"',
												' id="util-project-information-', projectTemplate.name, '-governance-decisions-collapse-container">',
												'<i class="fe fe-chevron-down text-muted ml-2 mt-2"></i>',
											'</a>',
										'</div>',
									'</div>',
								'</div>',
								'<div class="card-body p-0 collapse myds-collapse" id="util-project-information-', projectTemplate.name, '-governance-decisions-collapse">'
						]);

						_.each(projectTemplate.governance['tokenomics'], function (tokenomic)
						{
								informationView.add(
								[
									'<div class="card">',
										'<div class="card-body">',
											'<h3 class="fw-bold mb-0">Token ', tokenomic.name, '</h3>',
											'<div class="fw-bold mt-2 mb-0">Total</div>',
											'<div class="text-secondary">', tokenomic.total, '</div>',
										'</div>',
									'</div>'
								]);
						});

						informationView.add(
						[		
								'</div>',
							'</div>'
						]);
					}
				
					informationView.add(
					[		
							'</div>',
						'</div>'
					]);
				}

				// RULES

				if (_.has(projectTemplate, 'rules'))
				{
					informationView.add(
					[
						'<div class="card mt-1">',
							'<div class="card-header px-0">',
								'<div class="row align-items-end">',
									'<div class="col">',
										'<h3 class="mb-0" style="font-size:1.2rem;"><a class="ml-1 mr-1 myds-collapse-toggle text-dark" data-toggle="collapse" role="button" href="#util-project-information-', projectTemplate.name, '-rules-collapse"',
										' data-related-selector="#util-project-information-', projectTemplate.name, '-rules-collapse-container">',
										'Rules</a></h3>',
									'</div>',
									'<div class="col-auto pb-1">',
										'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#util-project-information-', projectTemplate.name, '-rules-collapse"',
											' id="util-project-information-', projectTemplate.name, '-rules-collapse-container">',
											'<i class="fe fe-chevron-down text-muted ml-2 mt-2"></i>',
										'</a>',
									'</div>',
								'</div>',
							'</div>',
							'<div class="card-body p-0 collapse myds-collapse" id="util-project-information-', projectTemplate.name, '-rules-collapse">'
					]);

					_.each(projectTemplate.rules, function (rule)
					{
						if (_.isArray(rule.description))
						{
							rule.description = _.join(rule.description, '');
						}

						informationView.add(
						[
							'<div class="card">',
								'<div class="card-body pb-0">',
									(_.isSet(rule.subject)?'<h4>' + rule.subject + '</h4>':''),
									rule.description,
								'</div>',
							'</div>'
						]);
					});

					informationView.add(
					[		
							'</div>',
						'</div>'
					]);
				}

				// RESOURCES

				if (_.has(projectTemplate, 'links') || _.has(projectTemplate, 'resources'))
				{
					var informationLinksView = app.vq.init({queue: 'util-project-information-show-links'});

					_.each(projectTemplate.links, function (link)
					{
						if (_.includes(link.for, userRole))
						{
                            var href = link.href;
                            if (href == undefined) {href = link.url}

                            if (href != undefined)
                            {
                                informationLinksView.add(
                                [
                                    '<div class="card">',
                                        '<div class="card-body px-0">',
                                            '<a href="', href, '" target="_blank">', link.description, '</a>',
                                        '</div>',
                                    '</div>'
                                ]);
                            }
						}
					});

					_.each(projectTemplate.resources, function (resource)
					{
						var show = _.isUndefined(resource.for)
						if (!show) {show = _.includes(resource.for, userRole)}

						if (show)
						{
							if (resource.description == undefined) {resource.description = ''};
							if (_.isArray(resource.description)) {resource.description = _.join(resource.description, '')}

							if (_.isSet(resource.url))
							{
								if (_.isNotSet(resource.subject))
								{
									resource.subject = _.replace(resource.url, 'https', '')
								}

								if (_.isNotSet(resource.description))
								{
									resource.description = '';
								}

								informationLinksView.add(
								[
									'<div class="card">',
										'<div class="card-body">',
											'<h4 class="mb-0"><a href="', resource.url, '" target="_blank">', resource.subject, '<i class="fe fe-external-link ms-1"></i></a></h4>',
											'<div class="text-secondary">', resource.description, '</div>',
										'</div>',
									'</div>'
								]);
							}
							else if (_.isSet(resource['image-url']))
							{
								informationLinksView.add(
								[
									'<div class="card">',
										'<div class="card-body">',
											'<div class="row align-items-end">',
												'<div class="col">',
													'<h4>', resource.subject, '</h4>',
												'</div>',
												'<div class="col-auto pb-1">',
													'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#util-project-information-resource-', _.kebabCase(resource.subject), '-collapse">',
														'<i class="fe fe-chevron-down text-muted ml-2 mt-2"></i>',
													'</a>',
												'</div>',
											'</div>',							
										'</div>',
										'<div class="p-4 pt-0 collapse myds-collapse" id="util-project-information-resource-', _.kebabCase(resource.subject), '-collapse"',
											' data-subject="', resource.subject, '">',
											'<div id="util-project-information-resource-', _.kebabCase(resource.subject), '">',
												'<div class="text-secondary">', resource.description, '</div>',
												'<img src="', resource['image-url'], '" class="img-responsive w-100">',
											'</div>',
										'</div>',
									'</div>'
								]);
							}
							else if (_.isSet(resource.description))
							{
								informationLinksView.add(
								[
									'<div class="card">',
										'<div class="card-body">',
											'<h4>', resource.subject, '</h4>',
											'<div class="text-secondary">', resource.description, '</div>',
										'</div>',
									'</div>'
								]);
							}
						}
					});

					var linksViewHTML = informationLinksView.get();

					if (linksViewHTML != '')
					{
						informationView.add(
						[
							'<div class="card mt-1">',
								'<div class="card-header px-0">',
									'<div class="row align-items-end">',
										'<div class="col">',
										'<h3 class="mb-0" style="font-size: 1.2rem;"><a class="ml-1 mr-1 myds-collapse-toggle text-dark" data-toggle="collapse" role="button" href="#util-project-information-resources-collapse"',
											' data-related-selector="#util-project-information-', projectTemplate.name, '-resources-collapse-container">',
											'Resources',
										'</a></h3>',
										'</div>',
										'<div class="col-auto pb-1">',
											'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#util-project-information-resources-collapse"',
												' id="util-project-information-', projectTemplate.name, '-resources-collapse-container">',
												'<i class="fe fe-chevron-down text-muted ml-2 mt-2"></i>',
											'</a>',
										'</div>',
									'</div>',
								'</div>',
								'<div class="card-body p-0 collapse myds-collapse" id="util-project-information-resources-collapse">'
						]);

						informationView.add(linksViewHTML);

						informationView.add(
						[		
								'</div>',
							'</div>'
						]);
					}
				}

				// MILESTONES

				if (_.has(projectTemplate, 'milestones'))
				{
					informationView.add(
					[
						'<div class="card mt-1">',
							'<div class="card-header px-0">',
								'<div class="row align-items-end">',
									'<div class="col">',
									'<h3 class="mb-0" style="font-size: 1.2rem;;"><a class="ml-1 mr-1 myds-collapse-toggle text-dark" data-toggle="collapse" role="button" href="#util-project-information-', projectTemplate.name, '-milestones-collapse"',
										' data-related-selector="#util-project-information-', projectTemplate.name, '-milestones-collapse-container">',
										'Milestones | Modules',
									'</a></h3>',
									'</div>',
									'<div class="col-auto pb-1">',
										'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#util-project-information-', projectTemplate.name, '-milestones-collapse"',
											' id="util-project-information-', projectTemplate.name, '-milestones-collapse-container">',
											'<i class="fe fe-chevron-down text-muted ml-2 mt-2"></i>',
										'</a>',
									'</div>',
								'</div>',
							'</div>',
							'<div class="card-body p-0 collapse myds-collapse" id="util-project-information-', projectTemplate.name, '-milestones-collapse"">'
					]);

					_.each(projectTemplate.milestones, function (milestone)
					{
						informationView.add(
						[
							'<div class="card">',
								'<div class="card-body pb-2">',
									'<div class="row align-items-end">',
										'<div class="col">',
											'<h4 class="mb-0"><a class="ml-1 mr-1 myds-collapse-toggle text-dark" data-toggle="collapse" role="button" href="#util-project-information-', projectTemplate.name, '-milestone-', milestone.reference,'-collapse"',
											' data-related-selector="#util-project-information-', projectTemplate.name, '-milestone-', milestone.reference,'-collapse-container">',
											milestone.reference, '. ', milestone.subject, '</a></h4>',
										'</div>',
										'<div class="col-auto pb-1">',
											'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#util-project-information-', projectTemplate.name, '-milestone-', milestone.reference,'-collapse"',
											' id="util-project-information-', projectTemplate.name, '-milestone-', milestone.reference,'-collapse-container">',
												'<i class="fe fe-chevron-down text-muted ml-2 mt-2"></i>',
											'</a>',
										'</div>',
									'</div>',							
								'</div>',
								'<div class="collapse myds-collapse" id="util-project-information-', projectTemplate.name, '-milestone-', milestone.reference,'-collapse"',
									' data-controller="explorer-template-info-render-milestone"',
									' data-on-show="false"',
									' data-on-hide="false"',
									' data-reference="', milestone.reference, '"',
                                    ' data-template="', projectTemplate.name, '"',
                                    '>',
									'<div id="util-project-information-', projectTemplate.name, '-milestone-', milestone.reference, '">',
										'<div class="text-muted small text-center p-4"></div>',
									'</div>',
								'</div>',
							'</div>'
						]);
					});

					informationView.add(
					[		
							'</div>',
						'</div>'
					]);
				}

				if (_.has(projectTemplate, 'skills.gained'))
				{
					informationView.add(
					[
						'<div class="card mt-1">',
							'<div class="card-header px-0">',
								'<div class="row align-items-end">',
									'<div class="col">',
									'<h3 class="mb-0" style="font-size: 1.2rem;"><a class="ml-1 mr-1 myds-collapse-toggle text-dark" data-toggle="collapse" role="button" href="#util-project-information-', projectTemplate.name, '-templates-gained-collapse"',
										' data-related-selector="#util-project-information-', projectTemplate.name, '-templates-gained-collapse-container">',
										'Skills Gained',
									'</a></h3>',
									'</div>',
									'<div class="col-auto pb-1">',
										'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#util-project-information-', projectTemplate.name, '-templates-gained-collapse"',
											' id="util-project-information-', projectTemplate.name, '-templates-gained-collapse-container">',
											'<i class="fe fe-chevron-down text-muted ml-2 mt-2"></i>',
										'</a>',
									'</div>',
								'</div>',
							'</div>',
							'<div class="pb-0 collapse myds-collapse" id="util-project-information-', projectTemplate.name, '-templates-gained-collapse">',
								'<div class="card-body px-0 pb-0">',
									'<div class="text-secondary text-left">',
										'The follow skills will be earned (as an achievement) once the project has been successfully completed and endorsed by your learning partner.',
									'</div>'
					]);

					if (false && projectTemplate['skill-capacities'] != undefined)
					{
						informationView.add(
						[
									'<div class="text-secondary mt-3 text-center">' +
										'You can be endorsed as a combination of the follow capacities; ' +
										_.join(_.map(projectTemplate['skill-capacities'], function (skillCapacity)
													{
														return app.whoami().mySetup.skillCapacities[skillCapacity] + ' (' + skillCapacity + ')'
													}), ', '),
										'.',
									'</div>'
						])
					}

					informationView.add(
					[
								'</div>',
								'<div class="card-body p-0">',
									'<div class="row">'
					]);

					var skillsContexts = projectTemplate.skills['scope-contexts'];

					if (skillsContexts == undefined)
					{
						skillsContexts =
						[
							{
								"name": "All"
							}
						]
					}
					
					_.each(skillsContexts, function (skillsContext)
					{
						skillsContext.caption = '<div class="row">';

						if (_.isSet(skillsContext['image-uri']))
						{
							skillsContext.caption += '<div class="col-2"><img src="' + skillsContext['image-uri'] + '" class="float-left rounded shadow ml-2" style="height:50px;"></div>'
						}

						skillsContext.caption += ('<div class="col-auto mt-3"><h3');

						if (_.isSet(skillsContext.style))
						{
							skillsContext.caption += ' style="' + skillsContext.style + '"'
						}

						skillsContext.caption += ('>' + skillsContext.name + '</h3>');
						 
						skillsContext.caption += '</div></div>';

						informationView.add(
						[
									'<div class="card">',
										'<div class="card-body pb-2">',
											'<div class="row align-items-end">',
												'<div class="col">',
													'<a class="ml-1 mr-1 myds-collapse-toggle text-dark" data-toggle="collapse" role="button" href="#util-project-information-templates-gained-', _.kebabCase(skillsContext.name), '-collapse">', skillsContext.caption, '</a>',
												'</div>',
												'<div class="col-auto pb-1">',
													'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#util-project-information-templates-gained-', _.kebabCase(skillsContext.name), '-collapse">',
														'<i class="fe fe-chevron-down text-muted ml-2 mt-2"></i>',
													'</a>',
												'</div>',
											'</div>',							
										'</div>',
										'<div class="collapse myds-collapse" id="util-project-information-templates-gained-', _.kebabCase(skillsContext.name), '-collapse"',
											' data-controller="util-project-information-show-tasks"',
											' data-name="', skillsContext.name, '">',
											'<div id="util-project-information-templates-gained-', _.kebabCase(skillsContext.name), '">',
												
						]);
	
						if (skillsContext.name == 'All')
						{
							skillsContext.skillsGained = projectTemplate.skills.gained
						}
						else
						{
							skillsContext.skillsGained = _.filter(projectTemplate.skills.gained, function(skillsGained)
							{
								return _.includes(skillsGained.scope.contexts, skillsContext.name)
							})
						}

						informationView.add('<div class="row">');
				
						_.each(skillsContext.skillsGained, function (skill)
						{
							skill._validationView = '';

							if (_.has(skill, 'validation.evidence'))
							{
								skill._validationView = '<div>';

								_.each(skill.validation.evidence, function (evidence)
								{
									skill._validationView += '<div class="text-secondary mt-4">' + evidence.description + '</div>'
								});

								skill._validationView += '</div>'
							}
						
							informationView.add(
							[
													'<div class="col-12">',
														'<div class="card shadow mb-2">',
															'<div class="card-body text-center p-3">',
																'<h4 class="mb-0">', skill.name, '</h4>',
																skill._validationView,
															'</div>',
														'</div>',
													'</div>'
							]);
						});

						informationView.add(
						[
												'</div>'
						])

						if (_.isSet(skillsContext.tokens))
						{
							informationView.add('<div class="row">');

							_.each(skillsContext.tokens, function (tokenCount, tokenName)
							{
								informationView.add([
									'<div class="col-12 text-center mx-auto w-75 text-secondary mb-4">',
										tokenCount, ' ', tokenName.toUpperCase(), ' tokens will be earned for each skill gained at this level.',
									'</div>'
								]);
							});

							informationView.add('</div>');
						}

						informationView.add(
							[
											'</div>',
										'</div>',
									'</div>'
						]);

						
					});

					informationView.add(
					[		
									'</div>',
								'</div>',
							'</div>',
						'</div>'
					]);
				}

				if (_.has(projectTemplate, 'version'))
				{
					informationView.add(
					[
						'<div class="card mt-1">',
							'<div class="card-header px-0">',
								'<div class="row align-items-end">',
										'<div class="col">',
										'<h3 class="mb-0" style="font-size: 1.2rem;"><a class="ml-1 mr-1 myds-collapse-toggle text-dark" data-toggle="collapse" role="button" href="#util-project-information-', projectTemplate.name, '-template-info-collapse"',
											' data-related-selector="#util-project-information-', projectTemplate.name, '-template-info-collapse-container">',
											'Template Info',
										'</a></h3>',
										'</div>',
										'<div class="col-auto pb-1">',
											'<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#util-project-information-', projectTemplate.name, '-template-info-collapse"',
												' id="util-project-information-', projectTemplate.name, '-template-info-collapse-container">',
												'<i class="fe fe-chevron-down text-muted ml-2 mt-2"></i>',
											'</a>',
										'</div>',
									'</div>',
							'</div>',
							'<div class="card-body px-0 pt-5 collapse myds-collapse" id="util-project-information-', projectTemplate.name, '-template-info-collapse">',
								'<div class="row">',
									'<div class="col-12">',
										'<div class="text-secondary">',
											projectTemplate.usage,
										'</div>',
									'</div>',
								'</div>',
								'<div class="row">'
					]);

								informationView.add(
								[
									'<div class="col-12 ml-4">',
										'<h4 class="fw-bold mt-3 mb-0">',
											'Version ', projectTemplate.version.number, 
										'</h4>',
										'<div class="text-secondary">', projectTemplate.version.date, '</div>',
								]);

								if (_.has(projectTemplate, 'sharing'))
								{
									informationView.add(
									[
										'<div class="text-secondary">',
											'Share As ', projectTemplate.sharing.type, 
										'</div>',
										'<div class="text-secondary">',
											projectTemplate.sharing.notes,
										'</div>'
									]);
								}

								if (_.has(projectTemplate, 'type'))
								{
									informationView.add(
									[
										'<h4 class="fw-bold mt-3 mb-0">Type</h4>',
										'<div class="text-secondary">', projectTemplate.type, '</div>'
									]);
								}

								if (_.has(projectTemplate, 'name'))
								{
									informationView.add(
									[
										'<h4 class="fw-bold mt-3 mb-0">Name</h4>',
										'<div class="text-secondary">', projectTemplate.name, '</div>'
									]);
								}

								if (_.has(projectTemplate, 'levels'))
								{
									informationView.add(
									[
										'<h4 class="fw-bold mt-3 mb-0">Levels</h4>',
										_.join(_.map(projectTemplate.levels, function (level) {return '<div class="text-secondary">' + level + '</div>'}), ''),
									]);
								}

								if (_.has(projectTemplate, 'domains'))
								{
									informationView.add(
									[
										'<h4 class="fw-bold mt-3 mb-0">Domains</h4>',
										_.join(_.map(projectTemplate.domains, function (domain) {return '<div class="text-secondary">' + domain + '</div>'}), ''),
									]);
								}

								if (_.has(projectTemplate, 'entity-types'))
								{
									informationView.add(
									[
										'<h4 class="fw-bold mt-3 mb-0">Entity Types</h4>',
										_.join(_.map(projectTemplate['entity-types'], function (entityType) {return '<div class="text-secondary">' + entityType + '</div>'}), ''),
									]);
								}

								if (_.has(projectTemplate, 'social-contracts.core'))
								{
									if (_.isSet(projectTemplate['social-contracts'].core))
									{
										informationView.add(
										[
											'<h4 class="fw-bold mt-3 mb-0">Core Social Contract</h4>',
											'<div class="text-secondary">', projectTemplate['social-contracts'].core, '</div>',
										]);
									}
								}

								if (_.has(projectTemplate, 'tokenomics'))
								{
									informationView.add(
									[
										'<h4 class="fw-bold mt-3 mb-0">Tokenomics</h4>',
										_.join(_.map(projectTemplate['tokenomics'], function (tokenomic) {return '<div class="text-secondary">' + tokenomic.name + ' (' + tokenomic.total + ')</div>'}), ''),
									]);
								}

								if (_.has(projectTemplate, 'approved-by'))
								{
									informationView.add(
									[
										'<h4 class="fw-bold mt-3 mb-0">Approved By</h4>',
										_.join(_.map(projectTemplate['approved-by'], function (approvedBy) {return '<div class="text-secondary">' + approvedBy.sdi + '</div>'}), ''),
									]);
								}

								if (_.has(projectTemplate, 'contracts'))
								{
									informationView.add(
									[
										'<h4 class="fw-bold mt-3 mb-0">Contracts</h4>',
										_.join(_.map(projectTemplate['contracts'], function (contract) {return '<div class="text-secondary">' + contract.description + ' (' + contract.type + (contract.core?'|core':'') + ')</div>'}), ''),
									]);
								}

								if (_.has(projectTemplate, 'source'))
								{
									informationView.add(
									[
										'<h4 class="fw-bold mt-3 mb-0">Source</h4>',
										'<div class="text-secondary">', projectTemplate.source.name, '</div>',
										'<div class="text-secondary">Shared by source as ', projectTemplate.source.sharing.type, '</div>',
										'<div class="text-secondary">', projectTemplate.source.notes, '</div>'
									]);
								}

								informationView.add(
								[
										'<h4 class="fw-bold mt-3 mb-0">Template ID</h4>',
										'<div class="text-secondary">BLAKE2b Hash</div>',
										'<div class="text-secondary w-75">', app.invoke('explorer-template-create-hash', templateData), '</div>'
								]);
							
					informationView.add(
					[		
									
									'</div>',
								'</div>',
							'</div>',
						'</div>'
					]);
				}
			}

			informationView.render(containerSelector);

		}
	}
});

entityos._util.controller.add(
{
	name: 'explorer-template-info-render-milestone',
	code: function (param)
	{
        if (param.status == 'shown')
        {
            var userRole = 'learning-partner';

            var templateData = entityos._util.data.get(
            {
                scope: 'explorer-template-info',
                context: 'template-data'
            });

			const type =entityos._util.data.get(
			{
				scope: 'explorer-template-info',
				context: 'template-data-type'
			});

            var projectTemplate = templateData.template[type];
            
            var milestoneReference = entityos._util.param.get(param.dataContext, 'reference').value;

            var milestone = _.find(projectTemplate.milestones, function (milestone)
                            {
                                return milestone.reference == milestoneReference
                            });

            if (milestone != undefined)
            {
                var milestoneView = app.vq.init({queue: 'util-project-information-show-milestone'});
                
                milestoneView.add(
                [
                    '<div class="card-body py-0">',
                        '<div class="row pb-4 pl-2">',
                            '<div class="col-12 text-secondary mb-3">',
                                '<div class="">', milestone['description'], '</div>',	
                            '</div>',
                        '</div>',
                        '<div class="row">',
                            '<div class="col-12">',
                                '<div class="d-none" id="util-project-information-', projectTemplate.name, '-milestone-', milestone.reference, '-support-items-container">',
                                '</div>',
                                '<div class="d-none" id="util-project-information-', projectTemplate.name, '-milestone-', milestone.reference, '-resources-container">',
                                '</div>',
                                '<div class="d-none" id="util-project-information-', projectTemplate.name, '-milestone-', milestone.reference, '-tasks-container">',
                                '</div>',
                            '</div>',
                        '</div>',
                    '</div>'
                ]);

                milestoneView.render('#util-project-information-' + projectTemplate.name + '-milestone-' + milestone.reference);

                // MILESTONE; TASKS

               	milestoneView.template(
                [
                    '<div class="card shadow mb-5">',
                        '<div class="card-body">',
                            '<div class="row">',
                                '<div class="col">',
                                    '<h4>{{subject}}</h4>',
                                    '<div class="text-secondary">{{description}}</div>',
                                '</div>',
								'<div class="col-auto text-right">',
									'<span class="badge text-muted border small">{{_by}}</span>',
								'</div>',
                            '</div>',	
                            '<div class="mt-3" id="util-project-information-', projectTemplate.name, '-milestone-', milestone.reference, '-task-{{hash}}">',
								'<div class="col-12">',
									'<div id="util-project-information-milestone-', milestone.reference, '-task-{{hash}}-resources-container">',
										'{{_resourcesHTML}}',
									'</div>',
									'<div id="util-project-information-milestone-', milestone.reference, '-task-{{hash}}-support-items-container">',
										'{{_supportItemsHTML}}',
									'</div>',
									'<div id="util-project-information-milestone-', milestone.reference, '-task-{{hash}}-reflections-container">',
										'{{_reflectionsHTML}}',
									'</div>',
								'</div>',
							'</div>',
                        '</div>',
                    '</div>'
                ]);

                if (milestone.tasks.length != 0)
                {
                    milestoneView.add(
                    [
                        '<h4 class="ml-2 fw-bold">Tasks | Units</h4>',
                    ]);

                    _.each(milestone.tasks, function (task)
                    {
                        task._by = _.capitalize(task.by);

                        task._hash = task.id;
                        if (task._hash == undefined)
                        {
                            task._hash = task.subject;
                        }

                        task._hash = milestone.reference + '--' + task._hash;

                        task.hash = app.invoke('util-protect-hash', {data: task._hash}).dataHashed;

						//Resources
						task._resourcesHTML = '';

						if (!_.isEmpty(task.resources))
						{
							task._resourcesHTML += '<h4 class="text-muted">Resources</h4><ul>';

							_.each(task.resources, function(resource)
							{	
								if (_.isNotSet(resource.subject)) {resource.subject = resource.url}
								task._resourcesHTML += '<li><a href="' + resource.url + '" target="_blank">' + resource.subject + '</a></li>'
							});

							task._resourcesHTML += '</ul>';
						}

						//Support Items

						task._supportItemsHTML = '';

						if (!_.isEmpty(task.supportitems))
						{
							task._supportItemsHTML += '<h4 class="text-muted">Support Items</h4><ul>';

							_.each(task['supportitems'], function(item)
							{	
								if (item.description == undefined) {item.description = ''}
								if (_.isSet(item.subject)) {item.description = '<div class="fw-bold">' + item.subject + '</div><div class="mt-1">' + item.description + '</div>'}
								task._supportItemsHTML += '<li>' + item.description + '</li>'
							});

							task._supportItemsHTML += '</ul>';
						}

						//Reflections
						task._reflectionsHTML = '';

						if (!_.isEmpty(task.reflections))
						{
							task._reflectionsHTML += '<h4 class="text-muted">Reflections | Quizzes</h4><ul>';

							_.each(task.reflections, function(reflection)
							{
								reflection._subject = reflection.subject;
								if (reflection._subject == undefined)
								{
									reflection._subject = reflection.description;
								}

								task._reflectionsHTML += '<li>' + reflection._subject;
								
								if (_.has(reflection, 'structure.options'))
								{
									task._reflectionsHTML += '<ul>'

									_.each(reflection.structure.options, function(option)
									{
										task._reflectionsHTML += '<li>' + option.caption + '</li>';
									});

									task._reflectionsHTML += '</ul>'
								}
								
								task._reflectionsHTML += '</li>'
							});

							task._reflectionsHTML += '</ul>';
						}

                        milestoneView.add({useTemplate: true}, task);
                    });
                }

                milestoneView.render('#util-project-information-' + projectTemplate.name + '-milestone-' + milestone.reference + '-tasks-container');
				$('#util-project-information-' + projectTemplate.name + '-milestone-' + milestone.reference + '-tasks-container')[(milestone.tasks.length==0?'addClass':'removeClass')]('d-none');

                // MILESTONE; RESOURCES

                var refresh = {};

                milestone.hasResources = false;
                if (milestone.notes != undefined) {milestone.hasResources = (milestone.notes.length != 0)}
                if (!milestone.hasResources && milestone.resources != undefined) {milestone.hasResources = (milestone.resources.length != 0)}

                //refresh[(milestone.hasResources?'show':'hide')] = '#util-project-information-', projectTemplate.name, '-milestone-' + milestone.reference + '-resources-container';
                //app.refresh(refresh);

                var resources = milestone.resources;

                if (_.isSet(milestone.notes))
                {
                    resources = _.assign(resources, milestone.notes);
                }

                resources = _.filter(resources, function (resource)
                {
                    return (_.includes(resource.for, userRole) || resource.for == undefined);
                });

                if (resources.length != 0)
                {
                    milestoneView.add(
                    [
                        '<h4 class="ml-2" style="color:#a0cced; font-size: 1.1rem;">Resources</h4>',
                    ]);

                    _.each(resources, function (resource)
                    {
                        if (resource.description == undefined) {resource.description = ''};
                        if (_.isArray(resource.description)) {resource.description = _.join(resource.description, '')}

                        if (_.isSet(resource.url))
                        {
                            milestoneView.add(
                            [
                                '<div class="card">',
                                    '<div class="card-body">',
                                        '<h4>', resource.subject, '</h4>',
                                        '<div><a href="', resource.url, '" target="_blank">', resource.description, ' <i class="far fa-external-link"></i></a></div>',
                                    '</div>',
                                '</div>'
                            ]);
                        }
                        else if (_.isSet(resource['image-url']))
                        {
                            milestoneView.add(
                            [
                                '<div class="card">',
                                    '<div class="card-body">',
                                        '<div class="row align-items-end">',
                                            '<div class="col">',
                                                '<h4>', resource.subject, '</h4>',
                                            '</div>',
                                            '<div class="col-auto pb-1">',
                                                '<a class="ml-1 mr-1 myds-collapse-toggle" data-toggle="collapse" role="button" href="#util-project-information-', projectTemplate.name, '-resource-', _.kebabCase(resource.subject), '-collapse">',
                                                    '<i class="fa fa-chevron-down text-muted ml-2 mt-2"></i>',
                                                '</a>',
                                            '</div>',
                                        '</div>',							
                                    '</div>',
                                    '<div class="p-4 pt-0 collapse myds-collapse" id="util-project-information-', projectTemplate.name, '-resource-', _.kebabCase(resource.subject), '-collapse"',
                                        ' data-subject="', resource.subject, '">',
                                        '<div id="util-project-information-', projectTemplate.name, '-resource-', _.kebabCase(resource.subject), '">',
                                            '<div class="text-secondary mb-4">', resource.description, '</div>',
                                            '<img src="', resource['image-url'], '" class="img-responsive w-100">',
                                        '</div>',
                                    '</div>',
                                '</div>'
                            ]);
                        }
                        else if (_.isSet(resource.description))
                        {
                            milestoneView.add(
                            [
                                '<div class="card">',
                                    '<div class="card-body">',
                                        '<h4>', resource.subject, '</h4>',
                                        '<div class="text-secondary">', resource.description, '</div>',
                                    '</div>',
                                '</div>'
                            ]);
                        }
                        
                    });

                    milestoneView.render('#util-project-information-' + projectTemplate.name + '-milestone-' + milestone.reference + '-resources-container');
					$('#util-project-information-' + projectTemplate.name + '-milestone-' + milestone.reference + '-resources-container')[(resources.length==0?'addClass':'removeClass')]('d-none');
                }

                // SUPPORT ITEMS

                var refresh = {};

                milestone.hasSupportItems = false;

                if (milestone['support-items'] != undefined) {milestone.hasSupportItems = (milestone['support-items'].length != 0)}
                if (!milestone.hasSupportItems && milestone['learner-support-items'] != undefined) {milestone.hasSupportItems = (milestone['learner-support-items'].length != 0)}

                refresh[(milestone.hasSupportItems?'show':'hide')] = '#util-project-information-', projectTemplate.name, '-milestone-' + milestone.reference + '-support-items-container';
                //app.refresh(refresh);

                var supportItems = milestone['support-items'];

                if (_.isSet(milestone['learner-support-items']))
                {
                    supportItems = _.assign(supportItems, milestone.notes);
                }

                supportItems = _.filter(supportItems, function (supportItem)
                {
                    return (_.includes(supportItem.for, userRole) || supportItem.for == undefined);
                });

                if (supportItems.length != 0)
                {
                    milestoneView.template(
                    [
                        '<div class="card">',
                            '<div class="card-body">',
                                '<div class="mb-3">{{subject}}</div>',
                                '<div class="text-secondary">{{description}}</div>',
                            '</div>',
                        '</div>'
                    ]);

                    milestoneView.add(
                    [
                        '<h4 class="ml-2" style="color:#a0cced; font-size: 1.1rem;">Items</h4>',
                    ]);

                    _.each(supportItems, function (item)
                    {
                        if (item.description == undefined) {item.description = ''}
                        if (_.isArray(item.description)) {item.description = _.join(item.description, '')}
                        milestoneView.add({useTemplate: true}, item);
                    });
                }

                milestoneView.render('#util-project-information-' + projectTemplate.name + '-milestone-' + milestone.reference + '-support-items-container');
				$('#util-project-information-' + projectTemplate.name + '-milestone-' + milestone.reference + '-support-items-container')[(supportItems.length==0?'addClass':'removeClass')]('d-none');
   
            }
        }
	}
});

entityos._util.controller.add(
{
    name: 'explorer-template-share',
    code: function (param)
    {
		const name = _.get(param, 'dataContext.name');
		const shareLink = 'https://skillzeb.io/template-explorer/' + name;

		navigator.clipboard.writeText(shareLink)
        .then(() => {
            $('#explorer-template-share-view-' + name).html('Copied to Clipboard')
        })
        .catch(err => {
            $('#explorer-template-share-view-' + name).html('Could Not Copy')
        });

		setTimeout(function () {
			$('#explorer-template-share-view-' + name).fadeOut('slow');
		}, 4000);

	}
});

entityos._util.controller.add(
{
    name: 'explorer-template-download',
    code: function (param)
    {
		const fileURL = _.get(param, 'dataContext.url');
		let fileName = _.get(param, 'dataContext.filename');

		if (fileURL != undefined)
		{
			if (fileName == undefined)
			{
				fileName = _.replace(fileURL, '/', '');
			}

			if (_.startsWith(fileName, '/'))
			{
				fileName = _.replace(fileName, '/', '');
			}

			$.ajax(
            {
                type: 'GET',
                url: fileURL,
				cors: false,
				cache: false,
                dataType: 'text',
                success: function(data)
                {
                  	app.invoke('util-export-to-file',
					{
						data: data,
						filename: fileName
					});
                }
            });
		}
	}
})

entityos._util.controller.add(
{
	name: 'explorer-template-create-hash',
	code: function (data)
	{
		if (_.isPlainObject(data))
		{
			const dataToHash = JSON.stringify(data);

			var hashedData = blake2bHex(dataToHash, null, 32);

			return hashedData;
		}
	}
});