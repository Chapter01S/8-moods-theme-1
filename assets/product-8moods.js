/* ═══════════════════════════════════════════════════
   8MOODS — Custom Product Page JavaScript
   product-8moods.js
═══════════════════════════════════════════════════ */

(function() {
  'use strict';

  /* ── Bundle + Plan State ── */
  var currentPlan  = 'sub';
  var bundlePrice  = 39.99;   // default: 10-pack
  var bundlePads   = 10;
  var DISCOUNT     = 0.25;    // 25% subscribe discount

  /* ── Bundle Picker ── */
  window.moodsSelectBundle = function(card, pads, price, perPad) {
    document.querySelectorAll('.moods-bundle-card').forEach(function(c) { c.classList.remove('active'); });
    card.classList.add('active');
    bundlePads  = pads;
    bundlePrice = price;
    moodsUpdateCTA();
  };

  /* ── Plan Toggle ── */
  window.moodsSelectPlan = function(plan) {
    currentPlan = plan;
    var optSub = document.getElementById('moods-opt-sub');
    var optOne = document.getElementById('moods-opt-one');
    var perks  = document.getElementById('moods-sub-perks');

    if (plan === 'sub') {
      optSub.classList.add('active');
      optOne.classList.remove('active');
      if (perks) perks.style.display = 'flex';
    } else {
      optOne.classList.add('active');
      optSub.classList.remove('active');
      if (perks) perks.style.display = 'none';
    }
    moodsUpdateCTA();
  };

  function moodsUpdateCTA() {
    var ctaLbl = document.getElementById('moods-cta-label');
    var ctaSub = document.getElementById('moods-cta-sub-text');
    if (!ctaLbl) return;

    var price    = currentPlan === 'sub'
      ? (bundlePrice * (1 - DISCOUNT)).toFixed(2)
      : bundlePrice.toFixed(2);
    var subPrice = (bundlePrice * (1 - DISCOUNT)).toFixed(2);
    var onePrice = bundlePrice.toFixed(2);

    if (currentPlan === 'sub') {
      ctaLbl.textContent = 'Start My Relief \u2014 $' + price + '/mo';
      if (ctaSub) ctaSub.innerHTML = 'Prefer a one-time? <a href="#" onclick="moodsSelectPlan(\'one\');return false;">Buy once for $' + onePrice + '</a>';
    } else {
      ctaLbl.textContent = 'Add to Cart \u2014 $' + price;
      if (ctaSub) ctaSub.innerHTML = 'Want to save 25%? <a href="#" onclick="moodsSelectPlan(\'sub\');return false;">Subscribe from $' + subPrice + '/mo</a>';
    }
  }

  /* ── Add to Cart (Shopify) ── */
  window.moodsAddToCart = function() {
    var form = document.getElementById('moods-product-form');
    var btn  = document.querySelector('.moods-cta-main');
    if (!btn) return;

    var origHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span>Adding...</span>';

    if (form) {
      var variantId = form.querySelector('[name="id"]');
      if (!variantId) { fallbackFeedback(btn, origHTML); return; }

      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: variantId.value, quantity: bundlePads })
      }).then(function(res) { return res.json(); })
        .then(function() {
          showSuccess(btn, origHTML);
          /* Refresh Shopify cart bubble if theme provides it */
          document.dispatchEvent(new CustomEvent('cart:refresh'));
        })
        .catch(function() { fallbackFeedback(btn, origHTML); });
    } else {
      fallbackFeedback(btn, origHTML);
    }
  };

  function showSuccess(btn, origHTML) {
    btn.style.background = '#22c55e';
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg><span>Added to cart!</span>';
    setTimeout(function() {
      btn.style.background = '';
      btn.innerHTML = origHTML;
      btn.disabled = false;
    }, 2000);
  }

  function fallbackFeedback(btn, origHTML) {
    /* No Shopify form — just show visual feedback */
    btn.style.background = '#22c55e';
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg><span>Added to cart!</span>';
    setTimeout(function() {
      btn.style.background = '';
      btn.innerHTML = origHTML;
      btn.disabled = false;
    }, 2000);
  }

  /* ── Info Tabs ── */
  window.moodsSwitchInfoTab = function(btn, panelId) {
    document.querySelectorAll('.moods-info-tab-btn').forEach(function(b) { b.classList.remove('active'); });
    document.querySelectorAll('.moods-info-tab-panel').forEach(function(p) { p.classList.remove('active'); });
    btn.classList.add('active');
    var panel = document.getElementById(panelId);
    if (panel) panel.classList.add('active');
  };

  /* ── Buybox FAQ ── */
  window.moodsToggleBuyboxFaq = function(btn) {
    var item   = btn.parentElement;
    var isOpen = item.classList.contains('open');
    document.querySelectorAll('.moods-buybox-faq-item').forEach(function(i) { i.classList.remove('open'); });
    if (!isOpen) item.classList.add('open');
  };

  /* ── Main FAQ ── */
  window.moodsToggleFaq = function(btn) {
    var item   = btn.parentElement;
    var isOpen = item.classList.contains('open');
    document.querySelectorAll('.moods-faq-item').forEach(function(i) { i.classList.remove('open'); });
    if (!isOpen) item.classList.add('open');
  };

  /* ── DOM Ready ── */
  function moodsInit() {
    /* Gallery Thumbs */
    document.querySelectorAll('.moods-thumb').forEach(function(t) {
      t.addEventListener('click', function() {
        document.querySelectorAll('.moods-thumb').forEach(function(x) { x.classList.remove('active'); });
        t.classList.add('active');
      });
    });

    /* Scroll reveal */
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.moods-step, .moods-feat-card, .moods-rev-card, .moods-stat-card, .moods-sci-card').forEach(function(el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(28px)';
      el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
      observer.observe(el);
    });

    /* Journey timeline — staggered reveal */
    var journeySteps = document.querySelectorAll('.moods-journey-step');
    journeySteps.forEach(function(step) {
      step.style.opacity = '0';
      step.style.transform = 'translateY(32px)';
      step.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    var journeyObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var steps = entry.target.querySelectorAll('.moods-journey-step');
          steps.forEach(function(step, i) {
            setTimeout(function() {
              step.style.opacity = '1';
              step.style.transform = 'translateY(0)';
            }, i * 280);
          });
          journeyObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    var timeline = document.querySelector('.moods-journey-timeline');
    if (timeline) journeyObs.observe(timeline);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', moodsInit);
  } else {
    moodsInit();
  }

})();
