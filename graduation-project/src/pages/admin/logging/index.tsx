import { Component } from 'react'
import { Card, Table, Button, Space, Pagination ,Popconfirm,message,Tooltip,ConfigProvider,Input} from 'antd'
import { SettingTwoTone, EditTwoTone, SearchOutlined,ReloadOutlined, } from '@ant-design/icons';
import axios from 'axios'
import zhCN from 'antd/lib/locale/zh_CN';
import qs from 'qs'
// import { Table,message,Space, Modal,Input,Select,Row,Col,Button,Pagination,ConfigProvider} from 'antd';
interface IProps {
    history:any
}

interface IState {
  loading: boolean,
  noticesData: any,
  pagenumber: number,
  referData: any,
  total: number
}
export default  class Main extends Component<IProps, IState>{
    constructor(props: IProps) {
        super(props)
        this.state = {
          loading: false,
          noticesData: [],
          pagenumber: 1,
          referData: {
            loggingTitle: '',
            loggingUser: '',
            loggingType:'',
            limit: 10,
            offset:0
          },
          total:0,
        }
  }
  componentDidMount() { 
    this.setState({
      loading:true
    }, () => { 
        setTimeout(() => {
          this.refer()
     },500)
    })
  }
  //公告标题查询
  public titleValueChange = (e:any) => {
    this.setState({
      referData: {
        ...this.state.referData,
        loggingTitle:e.target.value
      }
    })
  }
  //日志类型查询
  public TypeChange =(e:any) => {
    this.setState({
      referData: {
        ...this.state.referData,
        loggingType:e.target.value
      }
    })
  }
  //日志发布人查询
  public userChange = (e:any) => {
    this.setState({
      referData: {
        ...this.state.referData,
        loggingUser:e.target.value
      }
    })
  }
  //重置搜索
  public reset = () => {
    this.setState({
      referData: {
        loggingTitle: '',
        loggingType: '',
        loggingUser: '',
        limit: 10,
        offset:0
      }
    }, () => {
      this.refer()
    })
  }
  //查询数据
  public refer = () => {
    let referData = qs.stringify({
           ...this.state.referData
    });  
    axios.post("http://www.test.com/logging/select.php",referData).then((res: any) => {  
      if (res.data.code === 200) {
        this.setState({
          noticesData: res.data.data.data,
          total: res.data.data.count,
          loading:false
        })
      }
    }).catch((err:any)=>{ 
      console.log(err); 
    })
  }
  //页码变化跳转
   public pageChange = (page: number, pageSize: any) => { 
    console.log("123");
    this.setState({
      loading:true,
      pagenumber:page,
        ...this.state.referData,
        offset: (page - 1) * this.state.referData.limit,
    },
      () => { this.refer() }
    )
  }
  //每页数据变化跳转
  private onShowSizeChange = (current: number, size: number) => {
    console.log("456");
    this.setState({
      pagenumber: current,
    }, () => { 
        this.setState({
          loading:true,
          pagenumber: current,
          referData: {
          ...this.state.referData,
          limit: size,
          offset:(current-1) * size
        }
      }, () => { 
         this.refer() 
      })
    }
  )
  }
    //打开修改弹窗
  public openModal = (record: any) => {
      this.props.history.push({ pathname: '/admin/logging/edit', data:{list:record.list,title:'修改日志'}})
  }
  public openAudit =  (record:any) => {
    this.props.history.push({ pathname: '/admin/logging/audit',data:{list:record.list,}})
  }
    //删除用户数据
    public deleteData = (record: any) => { 
      let deleteData = qs.stringify({
        list: record.list
      });
      axios.post("http://www.test.com/logging/delete.php",deleteData).then((res: any) => {
        if (res.data.code === 200) { 
          message.success('删除数据成功')
          this.refer()
        }
         }).catch((err) =>{
          console.log(err); 
      })
    }
  //新增日志
    public add = () => {
        this.props.history.push({ pathname: '/admin/logging/edit', data: {title:'新增日志'}})
    }
    render() {
        const columns:any= [
            {
              title: '序号',
              dataIndex: 'number',
              align: 'center ' as 'center',
              width:'7%',
              render: (text: any,record:any,index:any) => `${(this.state.pagenumber-1)*this.state.referData.limit+index+1}`,
            },
            {
              title: '日志标题',
              dataIndex: 'loggingTitle',
              align: 'center ' as 'center',
              width: '16%',
              onCell: () => {
                return {
                  style: {
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow:'ellipsis',
                    cursor: 'pointer',
                    maxWidth:'220px'
                  }
                }
              },
              render: (text: any, record: any, index: any) => (
                <Tooltip placement="top" title={text}>
                  { text}
              </Tooltip >
            ),
              
            },
            {
              title: '日志类型',
              dataIndex: 'loggingType',
              align: 'center ' as 'center',
              width:'15%'
            },
            {
                title: '日志发布人',
                dataIndex: 'loggingUser',
                align: 'center ' as 'center',
                width:'15%'
            },
          {
            title: '日志发布时间',
            dataIndex: 'Time',
            align: 'center ' as 'center',
            width:'15%'
          }, 
            {
              title: '操作',
              width:'19%',
              align:'center 'as 'center',
              render: (text:any, record:any) => (
                <Space size="middle">                 
                  <a onClick={() => { this.openModal(record) }}><EditTwoTone onClick={() => {  this.openModal(record )}}/>修改</a>
                  <Popconfirm title="确认删除此项"
                     okText="Yes"
                     cancelText="No"
                    onCancel={() => {
                      console.log("用户取消删除")
                    }}
                    onConfirm={() => {      
                      this.deleteData(record)
                    }}>
                    <a> <SettingTwoTone />删除</a>
                 
                      </Popconfirm>
                    <a  onClick={() => { this.openAudit(record) }}> <SettingTwoTone onClick={() => { this.openAudit(record) }}/>查看</a>
                </Space>
              ),
            },
        ];
        return (
            <Card title="日志记录" extra={<Button type="primary" size="small" onClick={ this.add}>新增</Button>}>
                <div style={{
              marginBottom: '20px',
              marginLeft:'40px'
            }}>
              日志标题： <Input style={{
                width: "18%",
                marginRight: '30px'
              }}
                value={this.state.referData.loggingTitle}
                onChange={this.titleValueChange}
              ></Input>
            日志类型：<Input style={{
                width: "18%",
                marginRight: '30px'
              }}
                value={this.state.referData.loggingType}
                onChange={this.TypeChange}
              >
              </Input>
              日志发布人：<Input style={{
                 width:"18%",
              }}
                value={this.state.referData.loggingUser}
                onChange={this.userChange}
              >
              </Input>
              <div style={{ float:"right"}}>
              <Button type="primary" icon={<SearchOutlined />} style={{marginRight:'30px'}}onClick={this.refer}>查询</Button>
                <Button type="dashed" icon={<ReloadOutlined />}
                  onClick={this.reset}
                >重置</Button></div>
            </div>
            <Table columns={columns} dataSource={this.state.noticesData} loading={this.state.loading} rowKey={record => record.list} pagination={false} />
            <ConfigProvider locale={zhCN}>
            <Pagination
              total={this.state.total}
              showSizeChanger
              showQuickJumper
              onChange={this.pageChange}
              onShowSizeChange={this.onShowSizeChange}
              showTotal={total => `共 ${total}条数据 `}
              current={this.state.pagenumber}
              style={{
                marginTop: '30px',
                float:'right'
                }}
            />  </ConfigProvider>
          </Card> 
        );
    }

}