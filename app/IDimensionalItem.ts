import ISize = require("./geometry/ISize")
interface IDimensionalItem extends ISize.ISize {
    color: string;
}

export =  IDimensionalItem;