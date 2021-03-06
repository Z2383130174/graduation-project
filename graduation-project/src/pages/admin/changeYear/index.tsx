/* eslint-disable array-callback-return */
import { Component } from 'react'
import { Transfer, Select, Button, ConfigProvider, message, Card, Divider } from 'antd'
import {SearchOutlined } from '@ant-design/icons';
import qs from 'qs'
import axios from 'axios'
import zhCN from 'antd/lib/locale/zh_CN';
import React from 'react';
const { Option } = Select;
interface IProps {

}

interface IState {
  targetKeys: any,
  selectedKeys: any,
  Organization: any[],
  schoolClass: any[],
  userSchool: string,
  userClass: string,
  disabled: boolean,
  yearData:any[]
}
export default  class Main extends Component<IProps, IState>{
    constructor(props: IProps) {
        super(props)
        this.state = {
          targetKeys: [],
          yearData:[],
          selectedKeys: [],
          Organization: [],
          schoolClass: ['大一','大二','大三','大四'],
          userSchool: '',
          userClass: '',
          disabled:true
        }
    }
  componentDidMount() {
    // this.refer()
    this.getorganization()
  }
  public getorganization = () => {
    axios.post("http://www.test.com/adminuser/selectOrganization.php").then((res: any) => {   
      if (res.data.code === 200) {
      const arr=  res.data.data.data.map((item:any) => {
            return item.name
      })
        this.setState({
          Organization: [...arr],
        })
      } 
    }).catch((err) =>{
      console.log(err); 
  })
  }
  public onChange = (nextTargetKeys: any, direction: any, moveKeys: any) => {
      console.log('targetKeys:', nextTargetKeys);
      console.log('direction:', direction);
      console.log('moveKeys:', moveKeys);
      this.setState({
        targetKeys:nextTargetKeys
      })
    };
  
  public onSelectChange = (sourceSelectedKeys: any, targetSelectedKeys: any) => {
      console.log('sourceSelectedKeys:', sourceSelectedKeys);
      console.log('targetSelectedKeys:', targetSelectedKeys);
      this.setState({
        selectedKeys:[...sourceSelectedKeys, ...targetSelectedKeys]
      })
    };
  public schoolChange = (value:any) => {
    if (value ===undefined) {
      this.setState({
        userSchool: '',
        userClass: '',
        disabled:true
         })
    } else {
      this.setState({
        userSchool: value,
        userClass: '大一',
        disabled:false
      })
    }
  }
  public classChange = (value: any) => {
    this.setState({
      userClass: value
    })
  }
  //查询数据
  public refer = () => {
        if (this.state.userSchool) {
          if (this.state.userClass) {
              let referData = qs.stringify({
                userSchool: this.state.userSchool,
                userClass: this.state.userClass
              });
              axios.post("http://www.test.com/changeYear/selectAny.php", referData).then((res: any) => {
                if (res.data.code === 200) {
                  this.setState({
                    yearData: res.data.data.data
                  })
                }
              })
          } else {
            message.error('请选择年级')
          }
        }else {
          message.error('请选择团支部')
        }
      }
      public changeYear = () => {
        let updateData = qs.stringify({
          userSchool: this.state.userSchool,
          userClass: this.state.userClass,
          list:[...this.state.targetKeys]
        });
        if (this.state.userSchool) {
          if (this.state.userClass) {
            if (this.state.targetKeys && this.state.targetKeys.length > 0) {
              axios.post("http://www.test.com/changeYear/changeYear.php", updateData).then((res: any) => {
                message.success('年度转接成功')
                this.setState({
                  userClass: '',
                  userSchool: '',
                  targetKeys: [],
                  yearData:[],
                })
              })
            } else {
              message.error('请选择转接人员')
            }
          }else {
        message.error('请选择年级')
      }
    }else {
      message.error('请选择团支部')
    }
  }
    render() {
      return (
        <div>
          <div style={{fontFamily: "cursive", backgroundColor: "rgb(240, 226, 158)", color: "rgb(3 43 58)", height: "45px", fontSize: "20px", marginTop: "-24px",textAlign: "center",lineHeight: "45px",marginBottom:'10px'}}>请选择团支部以及年级来进行选择备选转接人员</div>
          <Card style={ {paddingBottom:0}}>
          <label htmlFor="" style={{
            fontFamily:'cursive',
            fontSize:'17px'
          }}>团支部：</label>  <Select
             value={this.state.userSchool}
             allowClear   
             style={{
               width: "14%",
             }}
             onChange={this.schoolChange}>
           { this.state.Organization.map((item:any,index:any) =>(
          <Option value={ item} key={index }>{item}</Option>
            ))}
            </Select>
            <label htmlFor="" style={{
              marginLeft: '50px',
              fontFamily:'cursive',
              fontSize:'20px'
            }}>年级：</label> <Select
             value={this.state.userClass}
             disabled={this.state.disabled}
             allowClear   
             style={{
             width: "14%"
             }}
             onChange={this.classChange}>
           { this.state.schoolClass.map((item:any,index:any) =>(
          <Option value={ item} key={index }>{item}</Option>
            ))}
          </Select>
          <Button type="primary" icon={<SearchOutlined />}  style={{ marginLeft: '50px' }} onClick={this.refer}>查询</Button>
            <Divider />
          <ConfigProvider locale={zhCN}>
            <Transfer
              rowKey={record => record.list} 
              listStyle={{
                width: 2500,
                height: 400,
              }}
              style={{
                marginTop: '10px'
              }}
              operations={['去右边', '去左边']}
              dataSource={this.state.yearData}
              titles={['备选转接人员', '已选转接人员']}
              targetKeys={this.state.targetKeys}
              selectedKeys={this.state.selectedKeys}
              onChange={this.onChange}
              onSelectChange={this.onSelectChange}
              render={(item:any) => (
                <div style={{fontFamily:'fangsong',fontSize:'18px'}}>
               <span style={{position:'absolute'}}>{item.rootname}</span>
               <span style={{marginLeft:'150px'}}>{item.userSchool}</span>
               <span style={{marginLeft:'150px'}}>{item.userClass}</span>
               </div> )}
            />
          </ConfigProvider>
          <Button type='primary' style={{float:'right',marginTop:'10px'}} onClick={this.changeYear}>开始转接</Button>
  </Card>
          </div>
          );
    }

}