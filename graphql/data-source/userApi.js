const {RESTDataSource} = require('@apollo/datasource-rest');

class UserAPI extends RESTDataSource {
    baseURL = process.env.PROFILE === 'local'
        ? 'http://localhost:5000/'
        : 'http://node2:3000'

    async getUser() {
        const {fromMongo} = await this.get('getUser');
        return fromMongo;
    }
}

module.exports = UserAPI;