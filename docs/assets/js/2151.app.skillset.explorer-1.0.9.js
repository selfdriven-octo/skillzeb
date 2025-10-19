
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

    entityos._util.factory.export();
    entityos._util.controller.invoke('explorer-skills-init');
    entityos._util.controller.invoke('explorer-init');
});

entityos._util.controller.add(
{
    name: 'explorer-init',
    code: function ()
    {
       var uriContext = window.location.pathname;

       if (uriContext != '/skillset-explorer')
       {
            var uriContextData = _.replace(uriContext, '/skillset-explorer/', '');

            if (uriContextData != '')
            {
                if (_.contains(uriContextData, 'domain:'))
                {
                    var searchDomainName = _.replace(uriContextData, 'domain:', '');
                    searchDomainName = _.replaceAll(searchDomainName, '-', ' ');
                    app.set({scope: 'explorer-skills', context: 'domain', value: searchDomainName});
                    app.set({scope: 'explorer-skills', context: '_domain', value: [searchDomainName]});
                }
                else
                {
                    $('#explorer-skills-search-text').val(uriContextData);
                    app.set({scope: 'explorer-skills', context: 'search-text', value: uriContextData});
                    app.set({scope: 'explorer-skills', context: 'capacity', value: -1});
                    $('#explorer-skills-search-capacity-text span.dropdown-text').html('All');
                }
                
                entityos._util.controller.invoke('explorer-skills-search');
            }
       }
    }
});

entityos._util.controller.add(
{
    name: 'explorer-skills-init',
    code: function ()
    {
        $.ajax(
        {
            type: 'GET',
            url: '/site/1401d861-0e78-4f33-b507-16e0aff64d32/data/skillzeb.domains-1.0.1.json',
			cors: false,
			cache: false,
            dataType: 'json',
            success: function(data)
            {
                var skillsDomainsView = app.vq.init({queue: 'skills-domains-view'});

                var domains = data.skillzeb.skills.domains;
                domains = _.sortBy(domains, 'name');

                app.set({scope: 'explorer-skills', context: 'skills-domains', value: domains});

                var searchDomainName = app.get({scope: 'explorer-skills', context: 'domain'});

                if (_.isSet(searchDomainName))
                {
                     $('input[data-id="' + searchDomainName + '"]').attr('checked', 'checked')
                }  

                var domain =
                {
                    human: _.find(domains, function (domain) {return domain.code == '00'}),
                    whoAmI: _.find(domains, function (domain) {return domain.code == '01'})
                }
               
                skillsDomainsView.add([
                    '<div class="row border-bottom border-gray-300 pb-2 mb-1">',
                    '<div class="col-12 text-muted small mb-1">Leave unticked for all.</div>',
                    '</div>'
                ]);

                var checked = (_.toLower(domain.human.name) == _.toLower(searchDomainName)?' checked="checked"':'');

                skillsDomainsView.add(
                [
                    '<div class="row pt-2">',
                        '<div class="col-2 text-center"><input type="checkbox" class="entityos-check" data-scope="explorer-skills" data-context="domain" data-id="', domain.human.name, '" " data-name="', _.kebabCase(domain.human.name), '" data-code="', domain.human.code, '"', checked, '"></div>',
                        '<div class="col-10">', 
                            '<div>', domain.human.name, ' <a href="#info" class="text-muted small" data-toggle="collapse"><i class="fe fe-info small"></i></a></div>',
                            '<div class="collapse text-secondary small" id="info">',
                                '<div>Uniquely Human Skills</div>',
								'<div class="text-muted">',
									'Wabi-Sabi (&#20328;&#23475)',
                                '</div>',
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

                var checked = (_.toLower(domain.whoAmI.name) == _.toLower(searchDomainName)?' checked="checked"':'');

                skillsDomainsView.add(
                [
                    '<div class="row border-bottom border-gray-300 pb-2 mb-2">',
                    '<div class="col-2 text-center"><input type="checkbox" class="entityos-check" data-scope="explorer-skills" data-context="domain" data-code="', domain.whoAmI.code, '" data-id="', domain.whoAmI.name, '" data-name="', _.kebabCase(domain.whoAmI.name), '"', checked, '"></div>',
                    '<div class="col-10">', domain.whoAmI.name, '</div>',
                    '</div>'
                ]);

                _.each(domains, function (domain)
                {
                    if (domain.code != '00' && domain.code != '01')
                    {
                        var checked = (domain.name == searchDomainName?' checked="checked"':'');

                        skillsDomainsView.add(
                        [
                            '<div class="row">',
                            '<div class="col-2 text-center"><input type="checkbox" class="entityos-check" data-scope="explorer-skills" data-context="domain" data-id="', domain.name, '" data-name="', _.kebabCase(domain.name), '" data-code="', domain.code, '"', checked, '></div>',
                            '<div class="col-10">', domain.name, '</div>',
                            '</div>'
                        ]);
                    }
                });

                skillsDomainsView.render('#explorer-skills-search-domain');
            },
            error: function (data) {}			
        });

        $.ajax(
        {
            type: 'GET',
            url: '/site/1401d861-0e78-4f33-b507-16e0aff64d32/data/skillzeb.sources-1.0.1.json',
			cors: false,
			cache: false,
            dataType: 'json',
            success: function(data)
            {
                var skillsSourcesView = app.vq.init({queue: 'skills-sources-view'});

                var sources = data.skillzeb.skills.sources;
                sources = _.sortBy(sources, 'name');

                app.set({scope: 'explorer-skills', context: 'skills-sources', value: sources});

                skillsSourcesView.add(
                [
                    '<li class="border-bottom border-gray-300 pb-2 mb-2"><a class="dropdown-item entityos-dropdown" data-id="-1">All</a></li>'
                ]);

                _.each(sources, function (source)
                {
                    skillsSourcesView.add(
                    [
                        '<li class="mb-1"><a class="dropdown-item entityos-dropdown" data-id="', source.name,'">', source.name, '</a></li>',
                    ]);
                });

                skillsSourcesView.render('#explorer-skills-search-source');
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
                var skillsLevelsView = app.vq.init({queue: 'skills-levels-view'});

                skillsLevelsView.add(
                [
                    '<li class="border-bottom border-gray-300 pb-2 mb-2"><a class="dropdown-item entityos-dropdown" data-id="-1">All</a></li>'
                ]);

                var levels = data.skillzeb.skills.levels;

                app.set({scope: 'explorer-skills', context: 'skills-levels', value: levels});

                _.each(levels, function (level)
                {
                    level._name = '<a class="dropdown-item entityos-dropdown" data-id="' + level.name + '">' + _.replace(level.name, 'Level ', '') + '</a>';

                    if (_.first(level.notes.usage) != '')
                    {
                        level._name = '<div class="col-3 text-center fw-bold">' + level._name + '</div><div class="col-9 text-wrap text-muted">' + _.first(level.notes.usage) + '</div>';
                    }
                    else
                    {
                        level._name = '<div class="col-3 text-center fw-bold">' + level._name + '</div><div class="col-9">-</div>'
                    }

                    skillsLevelsView.add(
                    [
                        '<li class="mb-1">',
                            '<div class="row">', level._name, '</div>',
                        '</a></li>',
                    ]);
                });

                skillsLevelsView.render('#explorer-skills-search-level');
            },
            error: function (data) {}			
        });

        $.ajax(
        {
            type: 'GET',
            url: '/site/1401d861-0e78-4f33-b507-16e0aff64d32/data/skillzeb.capacities-1.0.0.json',
			cors: false,
			cache: false,
            dataType: 'json',
            success: function(data)
            {
                var skillsCapacitiesView = app.vq.init({queue: 'skills-capacities-view'});

                var capacities = data.skillzeb.skills.capacities;
                capacities = _.sortBy(capacities, 'name');

                app.set({scope: 'explorer-skills', context: 'skills-capacities', value: capacities});

                skillsCapacitiesView.add(
                [
                    '<li class="border-bottom border-gray-300 pb-2 mb-2"><a class="dropdown-item entityos-dropdown" data-id="-1">All</a></li>'
                ]);

                _.each(capacities, function (capacity)
                {
                    skillsCapacitiesView.add(
                    [
                        '<li class="mb-1"><a class="dropdown-item entityos-dropdown" data-id="', _.first(capacity.name),'">', capacity.caption, ' (', capacity.name, ')</a></li>',
                    ]);
                });

                skillsCapacitiesView.render('#explorer-skills-search-capacity');
            },
            error: function (data) {}			
        });
    }
});

entityos._util.controller.add(
{
    name: 'explorer-skills',
    code: function ()
    {}
});

entityos._util.controller.add(
{
    name: 'explorer-skills-search',
    code: function ()
    {
        var skillsSet = app.get({scope: 'explorer-skills', context: 'skills-set'});

        if (skillsSet != undefined)
        {
            app.invoke('explorer-skills-search-process');
        }
        else
        {
            app.show('#explorer-skills-search-view', '<h3 class="text-muted text-center mt-6">Initialising skills set ...</h3>');

            $.ajax(
            {
                type: 'GET',
                url: '/site/1401d861-0e78-4f33-b507-16e0aff64d32/data/skillzeb.skills.set-1.0.0.json',
				cors: false,
				cache: false,
                dataType: 'json',
                success: function(data)
                {
                    app.set({scope: 'explorer-skills', context: 'skills-set', value: data.skillzeb.skills.set});
                    app.invoke('explorer-skills-search-process');
                },
                error: function (data) {}			
            });
        }
    }
});
           

entityos._util.controller.add(
{
    name: 'explorer-skills-search-process',
    code: function ()
    {
        var search = app.get({scope: 'explorer-skills', valueDefault: {}});
        console.log(search);

        var skillsSet = app.get({scope: 'explorer-skills', context: 'skills-set'});

        if (search.source != undefined && search.source != '-1')
        {
            if (search.source == 'skillzeb') {search.source = 'selfdriven'}
            
            skillsSet = _.filter(skillsSet, function (skill)
            {
                return (skill.source == search.source)
            })
        }

        if (search.level != undefined && search.level != '-1')
        {
            skillsSet = _.filter(skillsSet, function (skill)
            {
                return (skill.level == search.level)
            })
        }

        if (search.capacity == undefined) {search.capacity = 'C'}

        if (search.capacity != undefined && search.capacity != '-1')
        {
            skillsSet = _.filter(skillsSet, function (skill)
            {
                return (skill.capacity == search.capacity)
            });
        }

        if (!_.isEmpty(search._domain))
        {
			var _domains = [];
			_.each(search._domain, function (domain)
			{
				_domains.push(domain.toLowerCase());
			});

            skillsSet = _.filter(skillsSet, function (skill)
            {
                return _.includes(_domains, skill.domain.toLowerCase())
            });
        } 

        if (search['search-text'] != '' && search['search-text'] != undefined)
        {
            var searchText = search['search-text'].toLowerCase();

            skillsSet = _.filter(skillsSet, function (skill)
            {
                return  (_.includes(skill.code.toLowerCase(), searchText)
                            || _.includes(skill.sdi.toLowerCase(), searchText)
                            || _.includes(skill.name.toLowerCase(), searchText)
                            || _.includes(skill.notes.toLowerCase(), searchText)
                            || _.includes(skill.uri.toLowerCase(), searchText)
                        )
            });
        } 

        var skillsView = app.vq.init({queue: 'skills-view'});

        app.set({scope: 'explorer-skills', context: 'skills-set-searched', value: skillsSet});

        if (skillsSet.length == 0)
        {
            skillsView.add('<h3 class="text-muted text-center mt-6">There are no skills that match this search.</h3>');
        }
        else
        {
            var skillsCountText = 'There are ' + skillsSet.length + ' skills that match this search.';
            if (skillsSet.length == 1)
            {
                skillsCountText = 'There is one skill that matches this search.';
            }

            skillsView.add(
            [
                '<div class="row mx-auto" style="width:90%;">',
                    '<div class="col-10 text-muted"><h3 class="mt-2">', skillsCountText, '</h3></div>',
                    '<div class="col-2 text-center">',
                        '<button class="btn btn-sm btn-primary-outline shadow lift entityos-click" data-controller="explorer-skills-export">',
                            '<i class="fe fe-download-cloud"></i>',
                        '</button>',
                    '</div>',
                '</div>'
            ]);

            skillsView.add(['<div class="card mt-4"><div class="card-body pt-0">']);

            skillsSet = _.sortBy(skillsSet, 'name');

            var skillsLevels = app.get({scope: 'explorer-skills', context: 'skills-levels'});
            var limitReached = false;

            _.each(skillsSet, function (skill, s)
            {
                if (s > 149)
                {
                    if (!limitReached)
                    {
                        limitReached = true;
                        skillsView.add(
                        [
                            '<div class="text-center">',
                                '<h3 class="text-muted mt-6 mb-4">First 150 of ', skillsSet.length, ' skills shown.</h3>',
                                '<button class="btn btn-sm btn-primary-outline shadow lift entityos-click" data-controller="explorer-skills-export">',
                                    'Download All <i class="fe fe-download-cloud"></i>',
                                '</button>',
                            '</div>'
                        ]);
                    }
                }
                else
                {
                    skill._name = skill.name; //_.first(_.split(skill.name, ' ['));
                    skill._onchainassetname = _.replaceAll(skill.sdi, '-', '');

                    var _level = _.find(skillsLevels, function (skillLevel)
                    {
                        return skillLevel.name == skill.level
                    });

                    skill._level = _.replace(skill.level, 'Level ', '');
                    skill._levelNotesUsage = '';

                    var levelHTML = '<div>' + _.replace(skill.level, 'Level ', '') + '</div>';

                    if (_level != undefined)
                    {
                        if (_.first(_level.notes.usage) != '')
                        {
                            skill._levelNotesUsage = _.first(_level.notes.usage);
                            levelHTML = '<div>' + _.replace(levelHTML, 'Level ', '') + '</div><div class="text-muted" style="font-size:0.75rem;">e.g.' + _.first(_level.notes.usage) + '</div>';
                        }
                    }

                    skillsView.add(
                    [
                        '<div class="row pt-5 pb-3 border-bottom border-gray-300">',
                            '<div class="col-12 col-md-9 mb-2"><h2 class="text-dark fw-bold" style="font-size: 1.8rem;">', skill._name, '</h2></div>',
                            '<div class="col-12 col-md-3 mb-2"><h3 class="text-muted" style="text-align: right;">', skill.code, '</h3></div>',
                            '<div class="col-12 col-md-4 mb-2"><div class="text-muted small">Source</div><div>', skill.source, '</div></div>',
                            '<div class="col-12 col-md-3 mb-2"><div class="text-muted small">Domain</div><div>', skill.domain, '</div></div>',
                            '<div class="col-12 col-md-3 mb-2"><div class="text-muted small">Level</div><div>', levelHTML, '</div></div>',
                            '<div class="col-12 col-md-2 mb-2"><div class="text-muted small">Capacity</div><div>', skill.capacity, '</div></div>',
                            '<div class="col-12 col-md-4 mb-2"><div class="text-muted small">URI</div><div>', skill.uri, '</div></div>',
                            '<div class="col-12 col-md-8 mb-2"><div class="text-muted small">SZI</div><div>', skill.sdi, '</div></div>'
                    
                    ]);

                    if (skill.notes != '')
                    {
                        skillsView.add(['<div class="col-12 mb-2"><div class="text-muted small">Notes</div><div>', skill.notes, '</div></div>'])
                    }

                    skillsView.add('</div>')
                }
            });

            skillsView.add(['</div></div>']);
        }

        skillsView.render('#explorer-skills-search-view');
       
    }
});

entityos._util.controller.add(
{
    name: 'explorer-skills-export',
    code: function ()
    {
        app.invoke('util-export-data-as-is-to-csv',
        {
            scope: 'explorer-skills',
            context: 'skills-set-searched',
            filename: 'selfdriven-skills.csv'
        });
    }
});
    


