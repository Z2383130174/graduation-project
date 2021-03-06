import { Component } from 'react'
import { Card, Table, Button, Space, Pagination ,Popconfirm,message,Tooltip,ConfigProvider,Input,Select} from 'antd'
import { SettingTwoTone, EditTwoTone, SearchOutlined,ReloadOutlined, } from '@ant-design/icons';
import axios from 'axios'
import zhCN from 'antd/lib/locale/zh_CN';
import qs from 'qs'
const { Option } = Select;
interface IProps {
    history:any
}

interface IState {
  loading: boolean,
  noticesData: any,
  pagenumber: number,
  referData: any,
  total: number,
  Organization:any[]
}
export default  class Main extends Component<IProps, IState>{
    constructor(props: IProps) {
        super(props)
      this.state = {
          Organization:[],
          loading: false,
          noticesData: [],
          pagenumber: 1,
          referData: {
            title: '',
            school: '',
            userSchool:'',
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
      this.getorganization()
        setTimeout(() => {
          this.refer()
     },500)
    })
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
  //公告标题查询
  public noticeTitleValueChange = (e:any) => {
    this.setState({
      referData: {
        ...this.state.referData,
        title:e.target.value
      }
    })
  }
  //公告发布单位查询
  public SchoolChange =(e:any) => {
    this.setState({
      referData: {
        ...this.state.referData,
        school:e.target.value
      }
    })
  }
  //公告接受团支部查询
  public userSchoolChange = (value: any) => {
    if (value ===undefined) {
      this.setState({
        referData: { ...this.state.referData, userSchool: '',},
         })
    } else {
      this.setState({
        referData: {
          ...this.state.referData, userSchool: value,
        },
         })
    }
  }
  //重置搜索
  public reset = () => {
    this.setState({
      referData: {
        title: '',
        school: '',
        userSchool:'',
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
    axios.post("http://www.test.com/notice/select.php",referData).then((res: any) => {  
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
      this.props.history.push({ pathname: '/admin/NewsConstruction/notice/edit', data:{list:record.list,title:'修改公告发布'}})
  }
  public openAudit =  (record:any) => {
    this.props.history.push({ pathname: '/admin/NewsConstruction/notice/audit',data:{list:record.list,}})
  }
    //删除用户数据
    public deleteData = (record: any) => { 
      let deleteData = qs.stringify({
        list: record.list
      });
      axios.post("http://www.test.com/notice/delete.php",deleteData).then((res: any) => {
        if (res.data.code === 200) { 
          message.success('删除数据成功')
          this.refer()
        }
         }).catch((err) =>{
          console.log(err); 
      })
    }
  //新增公告
    public add = () => {
        this.props.history.push({ pathname: '/admin/NewsConstruction/notice/edit', data: {title:'新增公告发布'}})
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
              title: '公告标题',
              dataIndex: 'title',
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
              title: '公告接收对象',
              dataIndex: 'userSchool',
              align: 'center ' as 'center',
              width:'15%'
            },
            {
                title: '公告发布单位',
                dataIndex: 'school',
                align: 'center ' as 'center',
                width:'15%'
            },
            {
                title: '公示开始时间',
                dataIndex: 'startTime',
                align: 'center ' as 'center',
                width:'15%'
          }, 
          {
            title: '公示结束时间',
            dataIndex: 'endTime',
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
                    <a  onClick={() => { this.openAudit(record) }}> <SettingTwoTone onClick={() => { this.openAudit(record) }}/>审核</a>
                </Space>
              ),
            },
        ];
        return (
            <Card title="公告" extra={<Button type="primary" size="small" onClick={ this.add}>新增</Button>}>
                <div style={{
              marginBottom: '20px',
              marginLeft:'40px'
            }}>
              公告标题： <Input style={{
                width: "15%",
                marginRight: '30px'
              }}
                value={this.state.referData.title}
                onChange={this.noticeTitleValueChange}
              ></Input>
            公告接收对象：<Select style={{ 
                width: "15%",
                marginRight: '30px'
              }}
              allowClear
                value={this.state.referData.userSchool}
                onChange={this.userSchoolChange}
              >   { this.state.Organization.map((item:any,index:any) =>(
                <Option value={item} key={ index}>{item}</Option>
             ))}
              </Select>
              公告发布单位：<Input style={{
                 width:"15%",
              }}
                value={this.state.referData.school}
                onChange={this.SchoolChange}
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