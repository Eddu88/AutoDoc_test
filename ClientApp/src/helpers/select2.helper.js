import $ from 'jquery';
import 'select2';

/**
 * It's a function that initializes a select2 element with some default options.
 * @param parent - The parent element that contains the select element.
 * @param classChild - The class of the select element
 * @param [minimumInput=3] - The minimum number of characters that must be entered before the search is
 * performed.
 * @param [placeholder=Seleciona una opción] - placeholder,
 */
const selectInit = (parent, classChild, minimumInput = 3, placeholder = 'Seleciona una opción') => {
    $(parent).find(classChild).select2({
        placeholder: placeholder,
        //allowClear: true,
        theme: "bootstrap-5",
        containerCssClass: "select2--small",
        selectionCssClass: "select2--small",
        dropdownCssClass: "select2--small",
        minimumInputLength: minimumInput
    });

    $(parent).on('select2:open', () => {
        setTimeout(() => {
            document.querySelector('.select2-search__field').focus();
        }, 10);
    });
}

export {selectInit}