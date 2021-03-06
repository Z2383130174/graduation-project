import { Component } from 'react'
import { Card, Table, Button, Space, Pagination ,Popconfirm,message,Tooltip,ConfigProvider,Input} from 'antd'
import { SearchOutlined,ReloadOutlined, SettingTwoTone, EditTwoTone} from '@ant-design/icons';
import axios from 'axios'
import zhCN from 'antd/lib/locale/zh_CN';
import qs from 'qs'
// import { Table,message,Space, Modal,Input,Select,Row,Col,Button,Pagination,ConfigProvider} from 'antd';
interface IProps {
    history:any
}

interface IState {
  loading: boolean,
  acctivityData: any,
  pagenumber: number,
  referData: any,
  total: number
}
export default  class Main extends Component<IProps, IState>{
    constructor(props: IProps) {
        super(props)
        this.state = {
          loading: false,
          acctivityData: [],
          pagenumber: 1,
          referData: {
            limit: 10,
            offset: 0,
            titleValue: '',
            tecValue:''
          },
          total:0,
        }
  }
  componentDidMount() { 
      this.refer()
  }
  //延时查询数据
  public refer = () => {
    this.setState({
      loading:true
    }, () => { 
        setTimeout(() => {
          this.initRefer()
     },500)
    })
  }
  //重置
  public reset =()=>{
        this.setState({
                referData: {
                  limit: 10,
                  offset: 0,
                  titleValue: '',
                  tecValue:''
               }
        }, () => {
          this.refer()
        })
   }
  //标题改变搜索
  public teacherValueChange = (e:any) => {
    this.setState({
      referData: {
        ...this.state.referData,
        tecValue:e.target.value,
      }
    })
  }
  //姓名改变搜素
  public classTitleValueChange = (e:any) => {
    this.setState({
      referData: {
        ...this.state.referData,
        titleValue:e.target.value,
      }
    })
  }
  //查询数据
  public initRefer = () => {
    let referData = qs.stringify({
           ...this.state.referData
    });  
    axios.post("http://www.test.com/classInformation/select.php",referData).then((res: any) => { 
      if (res.data.code === 200) {
        this.setState({
          acctivityData: res.data.data.data,
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
    public openModal = (record:any) => {
      this.props.history.push({ pathname: '/admin/ActivityRecord/classInformation/edit', data:{list:record.list,pictureCreateTime:record.picture,title:'修改团课信息'}})
  }  
    //删除用户数据
    public deleteData = (record: any) => { 
      let deleteData = qs.stringify({
        list: record.list
      });
      axios.post("http://www.test.com/classInformation/delete.php",deleteData).then((res: any) => {
        if (res.data.code === 200) { 
          message.success('删除数据成功')
          this.refer()
        }
         }).catch((err) =>{
          console.log(err); 
      })
    }
  //新增团日活动
    public add = () => {
        this.props.history.push({ pathname: '/admin/ActivityRecord/classInformation/edit', data: {title:'新增团课'}})
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
              title: '团课标题',
              dataIndex: 'classTitle',
              align: 'center ' as 'center',
              width: '20%',
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
              title: '团课老师',
              dataIndex: 'classTec',
              align: 'center ' as 'center',
              width:'15%'
            },
            {
                title: '团课人数',
                dataIndex: 'classNumber',
                align: 'center ' as 'center',
                width:'8%'
            },
            {
                title: '团课开始时间',
                dataIndex: 'startTime',
                align: 'center ' as 'center',
                width:'19%'
          }, 
          {
            title: '团课结束时间',
            dataIndex: 'endTime',
            align: 'center ' as 'center',
            width:'19%'
          }, 
            {
              title: '操作',
              width:'20%',
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
                </Space>
              ),
            },
        ];
        return (

            <Card title="团日活动" extra={<Button type="primary" size="small" onClick={ this.add}>新增</Button>}>
        <div style={{
              marginBottom: '20px',
              marginLeft:'40px'
            }}>
              团课标题： <Input style={{
                width: "25%",
                marginRight: '150px'
              }}
                value={this.state.referData.titleValue}
                onChange={this.classTitleValueChange}
              ></Input>
            团课老师：<Input style={{
                 width:"25%",
              }}
                value={this.state.referData.tecValue} onChange={this.teacherValueChange}
              >
              </Input>
              <div style={{ float:"right"}}>
              <Button type="primary" icon={<SearchOutlined />} style={{marginRight:'30px'}}onClick={ this.refer}>查询</Button>
                <Button type="dashed" icon={<ReloadOutlined />}
                  onClick={this.reset}
                >重置</Button></div>
            </div>
            <Table columns={columns} dataSource={ this.state.acctivityData} loading={ this.state.loading} rowKey={record => record.list} pagination={false} /> 
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