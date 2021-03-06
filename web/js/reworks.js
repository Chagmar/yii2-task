if (typeof pistol88 == "undefined" || !pistol88) {
    var pistol88 = {};
}

pistol88.reworks = {
    init: function() {
        $(document).on('click', '.get_rework_comments', this.get_rework_comments);
        $(document).on('click', '.leave_unpayment_reworks', this.leave_unpayment_reworks);
        $(document).on('click', '.reworks_take_list', this.reworks_take_list);
        $(document).on('change', '.reworks_filter', this.reworks_filter);
        $(document).on('change', '.reworks_filter_members', this.reworks_filter_member);
        $(document).on('submit', '#reworks .add_rework', this.add_rework);
        $(document).on('click', '.scroll_bottom', this.scroll_bottom);
        
        this.rework_interface();
    },
    reworks_mass_interface: function() {
        var price_z = 0;
        var price_i = 0;
        var checked_numbers = new Array;
        $('.reworks_mass_userlist').html('');
        $.each($('.reworks_list .rework_check:checked'), function() {
            checked_numbers.push($(this).data('number'));
            var rework = $(this).parents('.rework_status_all');
            var perfomer_id = $(rework).data('perfomer');
            var ob_price = parseInt($(rework).data('ob-price'));
            var price = parseInt($(rework).data('price'));
            
            var perfomer_username = $(rework).data('perfomer-username');
            if(!$('.reworks_mass_userlist'+perfomer_id).length) {
                $('.reworks_mass_userlist').append('<li class="reworks_mass_userlist'+perfomer_id+'">'+perfomer_username+': <span>'+price+'</span></li>');
            }
            else {
                $('.reworks_mass_userlist'+perfomer_id+'>span').html(price+parseInt($('.reworks_mass_userlist'+perfomer_id+'>span').html()));
            }
            
            if($(rework).data('ob-price')) {
                price_z += ob_price;
                price_i += price;
                $('.reworks_mass_price span.z').html(price_z);
                $('.reworks_mass_price span.i').html(price_i);
            }
        });
        $('.reworks_mass_checked_ids').html('Reworks: '+checked_numbers.join(', '));
    },
    rework_interface: function() {
        $(document).mouseup(function (e) {
            var container = $(".full_rework");
            if (container.has(e.target).length === 0){
                $('.full_rework').remove();
            }
        });
        $(document).on('click', '.reworks_list > li.rework_status_all', function(e) {
            if(!$(e.target).val() && !$(e.target).hasClass('ajax_rework_status') && !$(e.target).hasClass('full_rework') && !$(e.target).parent().hasClass('full_rework') && $(this).find('.full_rework').length == 0) { 
                $('.full_rework').remove();
                $(this).after('<li class="full_rework">'+$(this).html()+'</li>');
                $('.full_rework').find('input[type=radio]').each(function() {
                    $(this).attr('name', $(this).attr('name')+'2');
                });
                if($('.full_rework .rework_comments').is(':hidden')) {
                    $('.full_rework .get_rework_comments').click();
                }
            }
        });
        
        $('.reworks_list .rework_check_all').on('click', function() {
            if($(this).prop('checked')) {
                $('.reworks_mass').show();
                pistol88.reworks.reworks_mass_interface();
            }
            else {
                $('.reworks_mass').hide();
            }
            $(this).parents('.reworks_list').find('.rework_check').prop('checked', $(this).prop('checked'));
        });
        
        $('.rework_check').on('click', function() {
            if($('.reworks_list .rework_check:checked').length) {
                $('.reworks_mass').show();
                pistol88.reworks.reworks_mass_interface();
            }
            else {
                $('.reworks_mass').hide();
            }
        });
        
        $('.rework_mass_payment').on('click', function() {
            $('.rework_check:checked').each(function() {
                $(this).parents('.rework_status_all').find('.ajax_rework_payment').val('yes').click();
            });
            
            $('#payment-to-reworks').find('span[data-role=payment-cost]').html($('.reworks_mass_price .z').html());
            $('#payment-to-reworks').find('input[data-role=payment-sum]').val($('.reworks_mass_price .z').html());
            $('#payment-to-reworks').find('textarea[data-role=payment-comment]').val($('.reworks_mass_checked_ids').html());
            
            $('#payment-to-reworks').modal('show');
        });
        
        $('.rework_mass_payment_member').on('click', function() {
            $('.rework_check:checked').each(function() {
                $(this).parents('.rework_status_all').find('.ajax_rework_payment_perfomer').val('yes').click();
            });
            
            $('#payment-to-reworks').find('span[data-role=payment-cost]').html($('.reworks_mass_price .i').html());
            $('#payment-to-reworks').find('input[data-role=payment-sum]').val($('.reworks_mass_price .i').html());
            $('#payment-to-reworks').find('textarea[data-role=payment-comment]').val($('.reworks_mass_checked_ids').html()+' - to '+$('.reworks_mass_userlist').text());
            
            $('#payment-to-reworks').modal('show');
        });
        
        $('.rework_mass_status_active').on('click', function() {
            $('.rework_check:checked').each(function() {
                $(this).parents('.rework_status_all').find('.ajax_rework_status').val('active').change();
            });
        });
        
        $('.rework_mass_status_close').on('click', function() {
            $('.rework_check:checked').each(function() {
                $(this).parents('.rework_status_all').find('.ajax_rework_status').val('close').change();
            });
        });
        
        $('.rework_mass_status_done').on('click', function() {
            $('.rework_check:checked').each(function() {
                $(this).parents('.rework_status_all').find('.ajax_rework_status').val('done').change();
            });
        });
    },
    scroll_bottom: function() {
        $("html,body").animate({"scrollTop":$("body").height()}, 800); 
        return false;
    },
    get_rework_comments: function() {
        var comments_list = $(this).siblings('.rework_comments').find('.comments_list');
        if($(comments_list).html() == '') {
            var rework_id = $(this).data('rework-id');
            $(comments_list).html('<li>...</li>');
            $.post(
                dvizh_cms_host+'comments_ajax/get_rework_comments',
                {ajax: "true", id: rework_id},
                function(answer) {
                    var json = $.parseJSON(answer);
                    $(comments_list).html(json.comments_list);
                }
            );
        }
        
        //$(this).siblings('.rework_comment').toggle('slow');
        $(this).siblings('.rework_comments').toggle('slow');
        return false;
    },
    rf_member: false,
    rf_status: false,
    rf_payment: false,
    rf_container: false,
    leave_unpayment_reworks: function() {
        pistol88.reworks.rf_container = $(this).parents('.reworks_control_panel').siblings('.reworks_list');
        if($(this).hasClass('active')) {
            $(this).removeClass('active');
            $('#reworks .reworks_list li').show('slow');
            pistol88.reworks.rf_payment = false;
        }
        else {
            $('#reworks .reworks_control_panel a').removeClass('active');
            $(this).addClass('active');
            pistol88.reworks.rf_payment = 'no';
        }
        pistol88.reworks.apply_reworks_filter();
        return false;
    },
    reworks_filter: function() {
        pistol88.reworks.rf_container = $(this).parents('.reworks_control_panel').siblings('.reworks_list');
        if($(this).val() == 'all') {
            pistol88.reworks.rf_status = false;
        }
        else {
            pistol88.reworks.rf_status = $(this).val();
        }
        pistol88.reworks.apply_reworks_filter();
    },
    reworks_take_list: function() {
        var textarea = $(this).siblings('textarea');
        $(textarea).toggle('slow');
        $(textarea).val('');
        $('.reworks_list li:visible').each(function() {
            var price = parseInt($(this).data('ob-price'));
            if(price > 0) {
                var price_str = " ("+dvizh_currency+""+price+")";
            }
            else {
                var price_str = "";
            }
            var line = $(this).find('.number span').html()+') '+$(this).find('.clear_rework_text').html()+''+price_str+"\n\n";
            $(textarea).val($(textarea).val()+line);
        });
        return false;
    },
    reworks_filter_member: function() {
        pistol88.reworks.rf_container = $(this).parents('.reworks_control_panel').siblings('.reworks_list');
        if($(this).val() == 'all') {
            pistol88.reworks.rf_member = false;
        }
        else {
            pistol88.reworks.rf_member = $(this).val();
        }
        pistol88.reworks.apply_reworks_filter();
    },
    apply_reworks_filter: function() {
        $(pistol88.reworks.rf_container).find('li').hide();
        $(pistol88.reworks.rf_container).find('li').each(function() {
            if(pistol88.reworks.rf_member && pistol88.reworks.rf_status) {
                if($(this).data('perfomer') == pistol88.reworks.rf_member && $(this).data('status') == pistol88.reworks.rf_status) {
                    $(this).show();
                }
            }
            else if(pistol88.reworks.rf_member) {
                if($(this).data('perfomer') == pistol88.reworks.rf_member) {
                    $(this).show();
                }
            }
            else if(pistol88.reworks.rf_status) {
                if($(this).data('status') == pistol88.reworks.rf_status) {
                    $(this).show();
                }
            }
            else {
                $(this).show();
            }

            if(pistol88.reworks.rf_payment) {
                if(parseInt($(this).data('price')) <= 0 | $(this).data('payment') != pistol88.reworks.rf_payment) {
                    $(this).hide();
                }
            }
        });
    },
    add_rework: function() {
        var form_element = $(this);
        var form_data = $(this).serialize();
        var form_action = $(this).attr('action');
        $(form_element).css('opacity', 0.3);
        $.post(
            form_action,
            form_data,
            function(answer) {
                var answer = $.parseJSON(answer);
                if(answer.error) {
                    alert(answer.error);
                }
                else {
                    $(form_element).css('opacity', 1);
                    $('#task-reworks-widget').replaceWith(answer.reworksWidgetHtml);
                    $("html,body").animate({"scrollTop":$("body").height()}, 800); 
                }
            }
        );
        return false;
    },
}

pistol88.reworks.init();