class ApiFeature {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }
    filter() {
        let queryString = { ...this.queryStr }
        let deleteFilter = ['sort', 'pagination', 'fields', 'limit', 'page'];
        deleteFilter.forEach((el) => {
            delete queryString[el]
        });
        let queryStringVal = JSON.stringify(queryString)
        queryStringVal = queryStringVal.replace(/\b(gte|gt|lte|lt)\b/, (match) => `$${match}`);
        const queryObject = JSON.parse(queryStringVal);
        this.query = this.query.find(queryObject);
        return this;
    }
    sort() {
        if (this.queryStr.sort) {
            const queryArr = this.queryStr.sort.split(',').join(" ")
            this.query = this.query.sort(queryArr)
        } else {
            this.query = this.query.sort('-createdAt')
        }
        return this;
    }
    fields() {
        if (this.queryStr.fields) {
            const queryArr = this.queryStr.fields.split(',').join(" ")
            this.query = this.query.select(queryArr)
        } else {
            this.query = this.query.select("-__v")
        }
        return this;
    }
      pagination(MovieModel)  {
        const limit = this.queryStr.limit * 1 || 1
        const page = this.queryStr.page * 1 || 1;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        // if (this.queryStr.page) {
        //     let MoviesCount = await MovieModel.countDocuments();
        //     if (skip >= MoviesCount) {
        //         throw new Error('The page is not found!')
        //     }
        // }
        return this;

    }
}
module.exports = ApiFeature