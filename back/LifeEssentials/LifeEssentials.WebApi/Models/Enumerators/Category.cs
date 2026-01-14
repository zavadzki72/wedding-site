using System.ComponentModel.DataAnnotations;

namespace LifeEssentials.WebApi.Models.Enumerators
{
    public enum Category
    {
        [Display(Name = "Eletrodoméstico")]
        ELETRODOMESTICO = 1,

        [Display(Name = "Móveis")]
        MOVEIS = 2,

        [Display(Name = "Decoração")]
        DECORACAO = 3,

        [Display(Name = "Cozinha")]
        COZINHA = 4,

        [Display(Name = "Cama, Mesa e Banho")]
        CAMA_MESA_BANHO = 5,

        [Display(Name = "Eletrônicos")]
        ELETRONICOS = 6,

        [Display(Name = "Ferramentas")]
        FERRAMENTAS = 7,

        [Display(Name = "Lazer")]
        LAZER = 8,

        [Display(Name = "Outros")]
        OUTROS = 9
    }
}
