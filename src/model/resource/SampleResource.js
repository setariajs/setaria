import UmeHttp from '../UmeHttp';

export default class SampleResource {
  /**
   * 使用id取得数据
   * @param  {String}  id 数据的标识
   * @return {Promise}
   */
  static getSampleDataById(id) {
    return UmeHttp.invoke('sample/S001', [id]);
  }

  /**
   * 使用type取得数据
   * @param  {String}  type 数据的类型
   * @return {Promise}
   */
  static getSampleDataByType(type) {
    return UmeHttp.invoke('sample/S002', [type]);
  }

  /**
   * 使用id和type取得数据
   * @param  {String} id   数据的标识
   * @param  {String} type 数据的类型
   * @return {Object}
   */
  static getSampleData(id, type) {
    const service1Config = {
      id: 'sample/S001',
      params: [id],
    };
    const service2Config = {
      id: 'sample/S002',
      params: [type],
    };
    const serviceArray = [service1Config, service2Config];
    return new Promise((resolve) => {
      UmeHttp.invokeMulti(serviceArray).then((res) => {
        const service1ResultObject = res[0];
        const service2ResultObject = res[1];
        resolve({
          service1ResultObject,
          service2ResultObject,
        });
      });
    });
  }
}
