
$(document).ready(function () {
    carregaMascaras();
});

function carregaMascaras() {

    $('.telefone').mask('(00)00000-0000');

    var SPphoneMask = function (phone, e, currentField, options) {
        return phone.match(/^(\(?11\)? ?9(5[0-9]|6[0-9]|7[01234569]|8[0-9]|9[0-9])[0-9]{1})/g) ? '(00)00000-0000' : '(00)0000-0000';
    };

    $(".celular").mask(SPphoneMask, {
        onKeyPress: function (phone, e, currentField, options) {
            $(currentField).mask(SPphoneMask(phone), options);
        }
    });

    $('.cep').mask('99999-999');

    $('.cnpj').mask('99.999.999/9999-99');

    $('.cpf').mask('999.999.999-99');

    $('.pis').mask('999.9999.999-9');

    //INscrição estadual SP
    $('.ie').mask('999.999.999.999');

    $('.mData').mask('99/99/9999');

    $('.mAgencia').mask('9999');

    $('.number1').mask('9');
    $('.number2').mask('99');
    $('.number3').mask('999');
    $('.number4').mask('9999');
    $('.number5').mask('99999');
    $('.number6').mask('999999');
    $('.number7').mask('9999999');
    $('.number8').mask('99999999');
    $('.number9').mask('999999999');
    $('.number10').mask('9999999999');
    $('.number11').mask('99999999999');

    $('.mesData').mask('99/9999');
    $('.moeda').mask('~000.000.000.000.000,00', { reverse: true });
    $('.moedaZero').mask('~000.000.000.000.000,00', { reverse: true });
 
    $('.moeda,.percentual,.percentual2').on('click focusin', function () {
        if (parseFloat(this.value.replace('.','').replace(',','.')) == 0)
            this.value = '';
    });

    $('.moeda,.percentual,.percentual2').on('focusout', function () {
        //if (this.value == '')
        //    this.value = '0,00';
        if (parseFloat(this.value.replace('.', '').replace(',', '.')) == 0)
            this.value = '';
    });
        

    $('.medida').mask('000.000,00', { reverse: true });
    $('.percentual').mask('000,00', { reverse: true });
    $('.percentual2').mask('00,00', { reverse: true });
    // Configuração para campos de Real.
    //$('.moeda').maskMoney({ showSymbol: true, symbol: "", decimal: ",", thousands: "." });
    //$('.valorReal').maskMoney({ showSymbol: true, symbol: "R$", decimal: ",", thousands: "." });
    //$(".valorReal").blur(function () { ($(this).closest('form')).validate().element(this) });


}
