/*Swiper Banner*/
if ($('.swiper-wrapper .swiper-slide').length < 2) { $('.swiper-pagination').hide() }
var mySwiper = new Swiper('.slider_banner', {
  effect: 'fade',
  speed: 1000,
  loop: true,
  autoplay: {
    delay: 114500,
    disableOnInteraction: false,
  },
  pagination: {
    el: '.slider_banner .swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.slider_banner .swiper-button-next',
    prevEl: '.slider_banner .swiper-button-prev',
  },
  on: {
    init: function() {
      var _that = this;
      setCurPage('.slider_banner', _that)
    }
  }
});

mySwiper.on('slideChange', function() {
  setCurPage('.slider_banner', mySwiper)
});

function setCurPage(sliderWrap, ele) {
  var curIndex = ele.realIndex + 1;
  var total = ele.slides.length - 2;
  var curHtml = '<i class="cur">' + curIndex + '</i>' + '<b class="line">/</b>' + '<i class="total">' + total + '</i>';
  $(sliderWrap).find('.slide-page-box').html(curHtml);
}


var swiper = new Swiper('.image-additional', {
  slidesPerView: 3,
  spaceBetween: 0,
  pagination: {
    el: '.product-view .swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.product-view .swiper-button-next',
    prevEl: '.product-view .swiper-button-prev',
  },
  breakpoints: {
    950: {
      slidesPerView: 3
    },
    480: {
      slidesPerView: 1,
      loop: true
    }
  }
})

var relatedSwiper = new Swiper('.goods-may-like .swiper-slider', {
  slidesPerView: 4,
  spaceBetween: 40,
  speed: 400,
  navigation: {
    nextEl: '.goods-may-like .swiper-button-next',
    prevEl: '.goods-may-like .swiper-button-prev',
  },
  breakpoints: {
    1680: {
      slidesPerView: 4
    },
    768: {
      slidesPerView: 2
    },
    480: {
      slidesPerView: 2,
      spaceBetween: 10
    }

  }
});


$('.head_nav li').each(function() {
  if ($(this).find('ul').length > 0) {
    $(this).children('a').append("<b></b>");
    $(this).addClass('has-child');
  }
})
// Navigation dropdown menu
dropMenu('.head_nav li', 'ul',0,'menu_show');

tabContainer('.tab-content-wrap', '.tab-title', '.tab-panel');

function hideMsgPop() { $('.inquiry-pop-bd').fadeOut('fast') }
if ($('body .inquiry-form-wrap').length > 0) {
  var webTop = $('body .inquiry-form-wrap').offset().top - 80
  $('.product-btn-wrap .email,.company_subscribe .button,.side_content .side_list .email').click(function() {
    $("html, body").animate({ scrollTop: webTop }, 1000);
    $(".ad_prompt").show().delay(3000).hide(300);
  })
} else {
  $('.product-btn-wrap .email,.company_subscribe .button,.side_content .side_list .email').click(function() {
    $('.inquiry-pop-bd').fadeIn('fast')
  })
}
$('.inquiry-pop,.product-btn-wrap .email,.company_subscribe .button,.side_content .side_list .email').click(function(e) { e.stopPropagation(); })
$(document).click(function() { hideMsgPop() })

function changeuRL(link) {
  var curUrl = document.location.href;
  var oldUrl = window.location.host + '/';
  var lgArr = ['fr/', 'de/', 'pt/', 'es/', 'ru/', 'ko/', 'ar/', 'ga/', 'ja/', 'el/', 'tr/', 'it/', 'da/', 'ro/', 'id/', 'cs/', 'af/', 'sv/', 'pl/', 'eu/', 'ca/', 'eo/', 'hi/', 'lo/', 'sq/', 'am/', 'hy/', 'az/', 'be/', 'bn/', 'bs/', 'bg/', 'ceb/', 'ny/', 'co/', 'hr/', 'nl/', 'et/', 'tl/', 'fi/', 'fy/', 'gl/', 'ka/', 'gu/', 'ht/', 'ha/', 'haw/', 'iw/', 'hmn/', 'hu/', 'is/', 'ig/', 'jw/', 'kn/', 'kk/', 'km/', 'ku/', 'ky/', 'la/', 'lv/', 'lt/', 'lb/', 'mk/', 'mg/', 'ms/', 'ml/', 'mt/', 'mi/', 'mr/', 'mn/', 'my/', 'ne/', 'no/', 'ps/', 'fa/', 'pa/', 'sr/', 'st/', 'si/', 'sk/', 'sl/', 'so/', 'sm/', 'gd/', 'sn/', 'sd/', 'su/', 'sw/', 'tg/', 'ta/', 'te/', 'th/', 'uk/', 'ur/', 'uz/', 'vi/', 'cy/', 'xh/', 'yi/', 'yo/', 'zu/', 'zh-CN/', 'zh-TW/'];
  $.each(lgArr, function(i, lenItem) {
    var lgUrl = oldUrl.toString() + lenItem;
    if (curUrl.indexOf(lgUrl) != -1) {
      link.each(function(i) {
        if (!$(this).parents().hasClass('language-flag')) {
          var iLink;
          if ($(this).prop('href')) {
            iLink = $(this).prop('href');
          }
          if (String(iLink).indexOf(oldUrl) != -1 && String(iLink).indexOf(lgUrl) == -1 && curUrl.indexOf(lgUrl) != -1) {
            var newLink = iLink.replace(oldUrl, lgUrl);
            $(this).attr('href', newLink);
          }
        }
      })
    }
  });
}
$(function() {
  changeuRL($('a'));
})
$(document).ready(function() {
  $('.change-language .change-language-cont').append("<div class='change-empty'>Untranslated</div>")
  $('.prisna-wp-translate-seo').append("<div class='lang-more'>More Language</div>")
  if ($('body .prisna-wp-translate-seo').length > 0 && $('.change-language .prisna-wp-translate-seo').length < 1) {
    $('.prisna-wp-translate-seo').appendTo('.change-language .change-language-cont')
    if ($('.change-language .change-language-cont .prisna-wp-translate-seo li').length > 0) {
      $('.change-language .change-language-cont .change-empty').hide()
      $('.change-language .change-language-cont .prisna-wp-translate-seo li').each(function(index) {
        if (index > 35) {
          $(this).addClass('lang-item lang-item-hide')
          $('.change-language-cont').find('.lang-more').fadeIn()
        } else {
          $('.change-language-cont').find('.lang-more').fadeOut()
        }
      })
      if ($('.change-language-cont .lang-more').length > 0) {
        $('.change-language-cont .lang-more').click(function() {
          if ($(this).parents('.change-language-cont').find('.prisna-wp-translate-seo li.lang-item').hasClass('lang-item-hide')) {
            $(this).parents('.change-language-cont').find('.prisna-wp-translate-seo li.lang-item').removeClass('lang-item-hide')
            $(this).addClass('more-active').text('×')
          } else {
            $(this).parents('.change-language-cont').find('.prisna-wp-translate-seo li.lang-item').addClass('lang-item-hide')
            $(this).removeClass('more-active').text('More Language')
          }
        })
      }
    } else {
      $('.change-language .change-language-cont .change-empty').fadeIn()
    }
  }
})
var mHeadTop = $('.web_head').offset().top
var $backToTopTxt = "TOP",
  $backToTopEle = $('<span class="gotop"></span>').appendTo($(".web_footer"))
  .html('<em>' + $backToTopTxt + '</em>').attr("title", $backToTopTxt).click(function() {
    $("html, body").animate({ scrollTop: 0 }, 600);
  }),
  $backToTopFun = function() {
    var st = $(document).scrollTop(),
      winh = $(window).height();
    (st > mHeadTop) ? $backToTopEle.addClass('active'): $backToTopEle.removeClass('active');
    if (!window.XMLHttpRequest) {
      $backToTopEle.css("top", st + winh - 210);
    }
  };
$(window).bind("scroll", $backToTopFun);
$(function() { $backToTopFun(); });



// get window size
var winWidth = 0;
var winHeight = 0;

function getWinSize() {
  if (window.innerWidth) {
    winWidth = window.innerWidth;
  } else if ((document.body) && (document.body.clientWidth)) {
    winWidth = document.body.clientWidth;
  }
  if (window.innerHeight) {
    winHeight = window.innerHeight;
  } else if ((document.body) && (document.body.clientHeight)) {
    winHeight = document.body.clientHeight;
  }
  if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
    if (window.innerWidth && window.innerHeight) {
      winWidth = window.innerWidth;
      winHeight = window.innerHeight;
    } else {
      winHeight = document.documentElement.clientHeight;
      winWidth = document.documentElement.clientWidth;
    }
  }
}
getWinSize();


var $nav = $('.web_head'),
  navTop = $('.nav_wrap').offset().top,
  headH = $nav.outerHeight(),
  winTop_1 = 0,
  spr = $('body').height() - $nav.height(),
  holder = jQuery('<div class="head_holder">');

function fixedTop() {
  var winTop_2 = $(window).scrollTop();
  holder.css('height', $('.nav_wrap').outerHeight());
  if (winTop_2 > headH && winWidth >= 950) {
    holder.show().appendTo($nav);
    $nav.addClass('fixed-nav');
    $nav.parents('body').addClass('fixed-body');
    setTimeout(function() { $nav.addClass('fixed-nav-active') });
  } else {
    holder.hide();
    $nav.removeClass('fixed-nav fixed-nav-active');
    $nav.parents('body').removeClass('fixed-body');
  }
  if (winTop_2 > winTop_1 && winWidth >= 950) {
    $nav.removeClass('fixed-nav-appear');
  } else if (winTop_2 < winTop_1) {
    $nav.addClass('fixed-nav-appear');
  }
  winTop_1 = $(window).scrollTop();
}
fixedTop();
$(window).on('scroll', function() {
  fixedTop();
})
$(window).on('resize', function() {
  fixedTop();
})


$('.faq-item').each(function(index) {
  var _this = $(this)
  var title = _this.find('.faq-title')
  var cont = _this.find('.faq-cont')
  if (index == 0) {
    title.addClass('show-title')
  }
  title.on('click', function() {
    if (cont.is(':hidden') && !$(this).hasClass('show-title')) {
      cont.slideDown('fast')
      $(this).addClass('show-title')
      _this.siblings().find('.faq-title').removeClass('show-title')
      _this.siblings().find('.faq-cont').slideUp('fast')
    } else {
      cont.slideUp('fast')
      $(this).removeClass('show-title')
    }
  })
})

function mSizeChange() {
  getWinSize();
  if (winWidth <= 950) {
    if ($('.mobile-head-items').length < 1) {
      var mobileService = '<div class="mobile-head-items"><div class="mobile-head-item mobile-head-nav"><div class="title"></div><div class="main-content-wrap side-content-wrap"><div class="content-wrap"></div></div></div><div class="mobile-head-item mobile-head-language"><div class="title"></div><div class="main-content-wrap side-content-wrap"><div class="content-wrap"></div></div></div><div class="mobile-head-item mobile-head-search"><div class="title"></div><div class="main-content-wrap middle-content-wrap"><div class="content-wrap"></div></div></div>'
      $('body').append(mobileService)
      if ($('body .aside').length > 0) {
        $('.mobile-head-items').append('<div class="mobile-head-item mobile-head-aside"><div class="title"></div><div class="main-content-wrap side-content-wrap"><div class="content-wrap"></div></div></div>')
      }
      $('.mobile-head-item').each(function() {
        $(this).find('.title').click(function() {
          if ($(this).parents('.mobile-head-item').find('.main-content-wrap').length > 0) {
            var pItem = $(this).parents('.mobile-head-item')
            if (!pItem.find('.main-content-wrap').hasClass('show-content-wrap')) {
              pItem.find('.main-content-wrap').addClass('show-content-wrap')
              pItem.find('.side-content-wrap').stop().animate({ 'left': '0' }, 300)
              pItem.find('.middle-content-wrap').addClass('middle-show-content-wrap')
              pItem.find('.side-content-wrap').append("<b class='mobile-ico-close'></b>")
              pItem.siblings('.mobile-head-item').find('.main-content-wrap').removeClass('show-content-wrap')
              pItem.siblings('.mobile-head-item').find('.side-content-wrap').stop().animate({ 'left': '-70%' }, 300)
              pItem.siblings('.mobile-head-item').find('.middle-content-wrap').removeClass('middle-show-content-wrap')
              pItem.siblings('.mobile-head-item').find('.side-content-wrap .mobile-ico-close').remove()
              if ($('.mobile-head-items').find('.mobile-body-mask').length < 1) {
                $('.mobile-head-items').append('<div class="mobile-body-mask"></div>')
              }
            } else {
              pItem.find('.main-content-wrap').removeClass('show-content-wrap')
              pItem.find('.side-content-wrap').stop().animate({ 'left': '-70%' }, 300)
              pItem.find('.middle-content-wrap').removeClass('middle-show-content-wrap')
              pItem.find('.side-content-wrap .mobile-ico-close').remove()
            }
            $('.mobile-body-mask').click(function() {
              $('.mobile-body-mask').remove()
              $('.mobile-head-item .main-content-wrap').removeClass('show-content-wrap')
              $('.mobile-head-item .side-content-wrap').animate({ 'left': '-70%' }, 300)
              $('.mobile-head-item .middle-content-wrap').removeClass('middle-show-content-wrap')
              $('.mobile-head-item .side-content-wrap .mobile-ico-close').remove()
            })
            $('.mobile-ico-close').click(function() {
              $('.mobile-body-mask').remove()
              $('.mobile-head-item .main-content-wrap').removeClass('show-content-wrap')
              $('.mobile-head-item .side-content-wrap').stop().animate({ 'left': '-70%' }, 300)
              $('.mobile-head-item .middle-content-wrap').removeClass('middle-show-content-wrap')
              $('.mobile-head-item .side-content-wrap .mobile-ico-close').remove()
            })
          }
        })
      })
      $('.change-currency ').clone().appendTo('.mobile-head-item.mobile-head-currency .main-content-wrap .content-wrap')
      $('.change-language .change-language-cont').clone().appendTo('.mobile-head-item.mobile-head-language .main-content-wrap .content-wrap')
      $('.nav_wrap .head_nav').clone().appendTo('.mobile-head-item.mobile-head-nav .main-content-wrap .content-wrap')
      $('.head-search:last').clone().appendTo('.mobile-head-item.mobile-head-search .main-content-wrap .content-wrap')
      $('.head_sns').clone().appendTo('.mobile-head-item.mobile-head-social .main-content-wrap .content-wrap')
      $('.aside .aside-wrap').clone().appendTo('.mobile-head-item.mobile-head-aside .main-content-wrap .content-wrap')
    }
  }
  //mobile end
  else {
    $(document).ready(function() {
      $('.mobile-body-mask,.mobile-head-items,.mobile-head-items,.mobile-nav-items,.mobile-cart-items,.mobile-tab-items').remove()
    });
  }
}
$(function() { mSizeChange(); })
$(window).resize(function() { mSizeChange() });


/*side*/
function sideCate(cateEle,siblingsStatus){
  $(cateEle).each(function() {
    if ($(this).find('ul').length ) {
      $(this).addClass('has-child');
      $(this).append("<span class='icon-cate icon-cate-down'></span>")
      $(this).children('.icon-cate').click(function(e) {
        var mEle=$(this).parent('li');
        var mList=$(this).parent('li').children('ul');
        var msiblings=$(this).parent('li').siblings('li');
        if(siblingsStatus==0){
          msiblings.removeClass('li_active');
          msiblings.children('ul').slideUp(150);
          msiblings.children('.icon-cate').removeClass('icon-cate-up').addClass('icon-cate-down');
        }
        if (mList.is(':hidden')) {
          mEle.addClass('li_active');
          mList.slideDown(150);
          $(this).removeClass('icon-cate-down').addClass('icon-cate-up');
        } else {
          mEle.removeClass('li_active');
          mList.slideUp(150);
          $(this).removeClass('icon-cate-up').addClass('icon-cate-down');
        }
        e.stopPropagation();
      })
    }
  }) 
}
$(function() {
  // side cate
  sideCate('.side-cate li',0);
  $('.side-cate,.side-cate ul').each(function(){
    if(!$(this).find('ul').length){
      $(this).addClass('cate-type-list');
    }
  })
  var $currentEle=$('.side-widget .side-cate .nav-current');
  if ($currentEle.parents('ul').length > 0 && $currentEle.find('ul').length > 0) {
    $currentEle.parents('ul').show()
    $currentEle.parents('li').addClass("show_li")
    $currentEle.parents('li.show_li').children('.icon-cate').removeClass('icon-cate-down').addClass('icon-cate-up')
    $currentEle.children('ul').show()
    $('.side-widget .side-cate .nav-current ').children('.icon-cate').removeClass('icon-cate-down').addClass('icon-cate-up');
  } else if ($currentEle.parents('ul').length > 0 && $currentEle.find('ul').length < 1) {
    $currentEle.parents('ul').show()
    $currentEle.parents('li').addClass("show_li")
    $currentEle.parents('li.show_li').children('.icon-cate').removeClass('icon-cate-down').addClass('icon-cate-up')
  } else if ($currentEle.parents('ul').length < 1 && $currentEle.find('ul').length > 0) {
    $currentEle.children('ul').show()
    $currentEle.children('.icon-cate').removeClass('icon-cate-down').addClass('icon-cate-up');
  }
})

/*tabContainer*/
function tabContainer(container, title, panel) {
  $(container).each(function() {
    $(this).find(title).each(function() {
      if ($(this).hasClass('current')) {
        j = $(this).index();
        $(this).parents(container).find(panel).eq(j).removeClass('disabled')
      }
      $(this).click(function() {
        i = $(this).index();
        $(this).addClass('current').siblings().removeClass('current');
        $(this).parents(container).find(panel).eq(i).show();
        $(this).parents(container).find(panel).not($(this).parents(container).find(panel).eq(i)).hide();
      })
    })
  })
}
/*search*/
document.documentElement.className = 'js';;
(function(window) {
  if (document.querySelector('.web-search')) {
    'use strict';
    var mainContainer = document.querySelector('.container'),
      searchContainer = document.querySelector('.web-search'),
      openCtrl = document.getElementById('btn-search'),
      closeCtrl = document.getElementById('btn-search-close'),
      inputSearch = searchContainer.querySelector('.search-ipt');

    function init() { initEvents() }

    function initEvents() {
      openCtrl.addEventListener('click', function() { if (!searchContainer.classList.contains("search--open")) { openSearch(); } else { closeSearch(); } });
      closeCtrl.addEventListener('click', closeSearch);
      document.addEventListener('keyup', function(ev) { if (ev.keyCode == 27) { closeSearch() } })
    }

    function openSearch() {
      mainContainer.classList.add('main-wrap--move');
      searchContainer.classList.add('search--open');
      setTimeout(function() { inputSearch.focus() }, 600)
    }

    function closeSearch() {
      mainContainer.classList.remove('main-wrap--move');
      searchContainer.classList.remove('search--open');
      inputSearch.blur();
      inputSearch.value = ''
    }
    init()
  }
})(window);


$(function() { $("#scrollsidebar").fix({ float: 'right', durationTime: 400 }); });
$('.business_right .events li').on('click', function() {
  $(this).addClass('current').siblings("li").removeClass('current')
  var i = $(this).index()
  $(this).parents('.index_business').find('.business_middle .tab_content').eq(i).addClass('current').siblings(".tab_content").removeClass('current')
})
$('table').each(function() {
  if (!$(this).parent().hasClass('table_wrap')) {
    $(this).wrap("<div class='table_wrap'><//div>")
  }
})


/* -------------- public Function --------------*/


/*!
 切换CLASS
 ----------
 * 说明:
 * btn:  按钮
 * cont: 操控的内容
 * cName: 切换的className
 * siblingsStatus: 同级是否关闭(0:关闭,其他值:不受click影响)
*/
function toggleClass(btn, cont, cName, hName, siblingsStatus) {
  var $btn = $(btn);
  var $cont = $(cont);
  if (siblingsStatus == 0) {
    $btn.parents(cont).siblings(cont).removeClass(cName).addClass(hName);
  }
  if ($btn.parents(cont).hasClass(cName)) {
    $btn.parents(cont).removeClass(cName).addClass(hName);
  } else {
    $btn.parents(cont).addClass(cName).removeClass(hName);
  }
}

// set head nav Direction
function menuDirection(ele) {
  var winW = $(window).innerWidth();
  $(ele).each(function() {
    if ($(this).find('ul').length) {
      var linkEleW = $(this).children('a').width();
      var offRight = winW - $(this).offset().left;
      var childLen = $(this).find('ul').length;
      var childrenWidth = childLen * 250 + 10;
      if (offRight < childrenWidth) {
        $(this).addClass('menu_left');
      } else {
        $(this).removeClass('menu_left');
      }
    }
  })
}

// dropMenu
function dropMenu(menuItem, menuList,menustatus,showClass) {
  var mouseover_tid = [];
  var mouseout_tid = [];
  if(showClass){
    showClass=showClass;
  }
  else{
    showClass='active';
  }
  $(menuItem).each(function(index) {
    $(this).hover(
      function() {
        var _self = this;
        clearTimeout(mouseout_tid[index]);
        mouseover_tid[index] = setTimeout(function() {
          if(menustatus=='1'){
            $(_self).children(menuList).slideDown(150);
          }
          $(_self).addClass(showClass);
        }, 150);
      },
      function() {
        var _self = this;
        clearTimeout(mouseover_tid[index]);
        mouseout_tid[index] = setTimeout(function() {
          if(menustatus=='1'){
            $(_self).children(menuList).slideUp(50);
          }
          $(_self).removeClass(showClass);
        }, 150);
      }
    );
  })
}




/* -------------- header --------------*/

// dropmenu direction
$(function() {
  menuDirection('.head_nav>li');
  $(window).on('resize', function() {
    menuDirection('.head_nav>li');
  })
})

$(function() {
  $('.nav_wrap').append('<span class="nav_btn_close"></span>');
  $('body').delegate('.head_nav li b', 'click', function() {
    var navItem = $(this).closest('li');
    var navMenu = navItem.children('ul');
    if (navMenu.is(':hidden')) {
      navMenu.slideDown(150, function() {
        navItem.addClass('active');
      });
    } else {
      navItem.removeClass('active');
      navMenu.slideUp(150);
    }
    return false;
  })
})





/* -------------- index --------------*/



// product
var pdSwiper = new Swiper('.product_slider .swiper-container', {
  slidesPerView: 4,
  spaceBetween: 0,
  watchOverflow:true,
  loop: false,
  navigation: {
    nextEl: '.product_slider .swiper-button-next',
    prevEl: '.product_slider .swiper-button-prev',
  },
  pagination: {
    el: '.product_slider .swiper-pagination',
    clickable: true,
  },
  breakpoints: {
    1024: {
      slidesPerView: 3,
      spaceBetween: 0
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 0
    },
    480: {
      slidesPerView: 2,
      spaceBetween: 0
    }
  }
});


var businessSwiper = new Swiper('.business_slider .swiper-container', {
  slidesPerView: 1,
  slidesPerGroup:1,
  loop:true,
  autoplay: {
    delay: 4500,
    disableOnInteraction: false,
  },
  speed:400,
  spaceBetween: 0,
  effect: 'slide',
  watchOverflow:true,
  pagination: {
    el: '.index_business .swiper-pagination',
    clickable: true,
  },
  navigation: {
  },
  breakpoints: {
  }
})





// index_company_intr
if($('.index_company_intr .swiper-slide').length<2){
  $('.index_company_intr .swiper_control').hide();
}
var introSwiper = new Swiper('.company_intr_slider .swiper-container', {
  slidesPerView: 1,
  slidesPerGroup:1,
  loop:true,
  autoplay: {
    delay: 4500,
    disableOnInteraction: false,
  },
  speed:400,
  spaceBetween: 0,
  effect: 'slide',
  watchOverflow:true,
  pagination: {
    el: '.index_company_intr .swiper-pagination',
    clickable: true,
    renderBullet: function (index, className) {
      var bulletIndex=index+1<10?'0'+(index+1):index+1;
      return '<span class="' + className + '">' + bulletIndex + '</span>';
    },
  },
  navigation: {
  },
  breakpoints: {
  }
})

// index_news
if($('.index_news .swiper-slide').length<2){
  $('.index_news .swiper_control').hide();
}
var newsSwiper = new Swiper('.news_thumbs .swiper-container', {
  slidesPerView: 1,
  slidesPerGroup:1,
  loop:true,
  autoplay: {
    delay: 4500,
    disableOnInteraction: false,
  },
  speed:400,
  spaceBetween: 0,
  effect: 'fade',
  watchOverflow:true,
  pagination: {
    el: '.index_news .swiper-pagination',
    clickable: true,
  },
  navigation: {
  },
  breakpoints: {
  }
})




/* -------------- subpage --------------*/
var sideProduct = new Swiper('.side_slider', {
  slidesPerView: 4,
  slidesPerGroup: 1,
  spaceBetween: 0,
  direction: 'vertical',
  navigation: {
    nextEl: '.side-product-items .btn-next',
    prevEl: '.side-product-items .btn-prev',
  },
  pagination: {
    el: '.side-product-items .swiper-pagination',
    clickable: true,
  },
});


if($('.sys_sub_head .head_bn_item').length<2){
  $('.sys_sub_head .swiper-control').hide();
}
var hdSwiper = new Swiper('.head_bn_slider',{
  effect: 'fade',
  speed: 1000,
  loop:true,
  spaceBetween: 0,
  watchOverflow:true,
  autoplay: {
       delay: 3500,
       disableOnInteraction: false,
    },
  pagination: {
       el: '.sys_sub_head .swiper-pagination',
       clickable: true,
    }
});


// search
$(function() {
  $(document).on('click', function() {
    $('.container').removeClass('main-wrap--move');
    $('.web-search').removeClass('search--open');
  })
  $('.btn--search,.web-search').on('click', function(e) {
    e.stopPropagation();
  })
})


// button
$(".sys_btn_wave").mouseenter(function(e) {
  var parentOffset = $(this).offset();
  var relX = e.pageX - parentOffset.left;
  var relY = e.pageY - parentOffset.top;
  $(this).find(".btn_wave_circle").css({ "left": relX, "top": relY });
  $(this).find(".btn_wave_circle").removeClass("desplode-circle");
  $(this).find(".btn_wave_circle").addClass("explode-circle");
});
$(".sys_btn_wave").mouseleave(function(e) {
  var parentOffset = $(this).offset();
  var relX = e.pageX - parentOffset.left;
  var relY = e.pageY - parentOffset.top;
  $(this).find(".btn_wave_circle").css({ "left": relX, "top": relY });
  $(this).find(".btn_wave_circle").removeClass("explode-circle");
  $(this).find(".btn_wave_circle").addClass("desplode-circle");
});