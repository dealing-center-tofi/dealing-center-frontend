import { Component, EventEmitter, OnInit, ElementRef, Output } from '@angular/core';
import { AppConfig } from '../../app.config';
import { AccountService } from '../../services/account.service';
import { OrdersService } from '../../services/orders.service';
import { RoundHelper } from '../../helpers/roundHelper';
declare var jQuery: any;

@Component({
  selector: '[navbar]',
  templateUrl: './navbar.template.html'
})
export class Navbar implements OnInit {
  @Output() toggleSidebarEvent: EventEmitter<any> = new EventEmitter();
  @Output() toggleChatEvent: EventEmitter<any> = new EventEmitter();
  $el: any;
  config: any;
  round = RoundHelper.round;
  amount;
  funds;

  constructor(el: ElementRef,
              config: AppConfig,
              private accountService: AccountService,
              private ordersService: OrdersService) {
    this.$el = jQuery(el.nativeElement);
    this.config = config.getConfig();

    this.accountService.account.subscribe( res => {
      this.amount = res.amount;
      this.ordersService.getOrders().subscribe( res => {
        let profit = this.ordersService.getOrdersProfit(res);
        this.funds = this.amount + (isNaN(profit) ? 0 : profit);
      });
    });
  }

  toggleSidebar(state): void {
    this.toggleSidebarEvent.emit(state);
  }

  toggleChat(): void {
    this.toggleChatEvent.emit(null);
  }

  ngOnInit(): void {
    setTimeout(() => {
      let $chatNotification = jQuery('#chat-notification');
      $chatNotification.removeClass('hide').addClass('animated fadeIn')
        .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
          $chatNotification.removeClass('animated fadeIn');
          setTimeout(() => {
            $chatNotification.addClass('animated fadeOut')
              .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd' +
                ' oanimationend animationend', () => {
                $chatNotification.addClass('hide');
              });
          }, 8000);
        });
      $chatNotification.siblings('#toggle-chat')
        .append('<i class="chat-notification-sing animated bounceIn"></i>');
    }, 4000);

    this.$el.find('.input-group-addon + .form-control').on('blur focus', function(e): void {
      jQuery(this).parents('.input-group')
        [e.type === 'focus' ? 'addClass' : 'removeClass']('focus');
    });
  }
}
