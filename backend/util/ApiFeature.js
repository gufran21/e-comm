class ApiFeature {
  constructor(query, querystr) {
    this.query = query;
    this.querystr = querystr;
  }
  search() {
    const keyword = this.querystr.keyword
      ? {
          name: {
            $regex: this.querystr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find(keyword);
    return this;
  }
  filter() {
    const copyquerystr = { ...this.querystr };

    const removekeyquery = ["keyword", "page", "limit"];
    removekeyquery.forEach((key) => {
      delete copyquerystr[key];
    });
    // filter for price
    let querystr = JSON.stringify(copyquerystr);
    querystr = querystr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(querystr));
    return this;
  }
  ///pagination 
  pagination(resultPerPage){
   
    const currentPage=Number(this.querystr.page)||1;
    const skip=resultPerPage*(currentPage-1)
    this.query=this.query.limit(resultPerPage).skip(skip)
    return this
  }
}
module.exports = ApiFeature;
