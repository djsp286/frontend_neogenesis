import React from 'react'
import Page from 'components/Page';
import {Alert, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Table, Form, FormGroup, Label, Input} from 'reactstrap';
// import SupplierModal from './Supplier';
import SearchOutletPL from './SearchOutletPL'
import { MdDeleteForever, MdDoneAll, MdRemoveCircleOutline  } from "react-icons/md";
import { TiDocumentAdd, TiCancelOutline } from "react-icons/ti";


class CopyPembelianLokal extends React.Component{

    constructor(props) {
        super(props);       
        this.state = {
            outletData : [],
            outletDataInitialResult : [],
            matchOutletData : [],
            produkData : [],
            saveData : [],
            findBy: '',
            divisi : '', 
            value: '',
            out_code : '',
            out_comco : '',
            out_name : '',
            kota_name : '',
            out_citycode : '',
            matchOutletCode : '',
            findOutletModal : false,
            saveOutletModal : false,
            cancelOutletModal : false,
            saveVisible : false
        };
        
    }


    //request data outlet 
    componentDidMount = () => {
        // let url = `http://10.0.111.52:8086/FindDataOutlet`
        let url = `https://api.docnet.id/CHCMasterE/FindDataOutlet`
        
        fetch(url)
        .then(blob => blob.json() )
        .then((data) => {

            try {
                data = data.filter((v) => {
                    return v.out_Code !== '';
                });
                
                this.setState({
                    outletData : data,
                    outletDataInitialResult : data
                    // ,initialSupplierResult: data
                });
                
            } catch (error) {
                console.log('Something went wrong ' + error)
                this.setState({
                    outletData : [],
                    outletDataInitialResult : []
                })
            }
           
        });        
    }

   

    getDetailOutlet=(kode, nama, kota, cityCode)=>{
        this.setState({
            out_code : kode,
            // out_comco : comco,
            out_name : nama,
            kota_name : kota,
            out_citycode : cityCode,
            produkData : []
        },()=>{
            this.requestMatchOutlet();
        });
        
        
    }

    requestMatchOutlet=()=>{
        
        // let url = `http://10.0.111.54:8086/CTMPL/matchOutlet/${this.state.out_code}/${this.state.out_citycode}`
        let url = `https://api.docnet.id/CHCMasterE/CTMPL/matchOutlet/${this.state.out_code}/${this.state.out_citycode}`
        
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                buylcld_outcode : this.state.out_code,
                out_citycode : this.state.out_citycode
    
            })
            })
            .then(blob => blob.json() )
            .then((data) => {
                data = data.filter((v) => {
                    return v.out_code !== '';
                });
    
                console.log(data)
                let newData = data
                this.setState({
                    matchOutletData: newData
                });
    
            });
           
    }

    getDetailMatchOutlet=(kode)=>{
        this.setState({
            matchOutletCode : kode
        },()=>{
            this.requestProduct();
        });
    }

    requestProduct=()=>{

        // let url = `http://10.0.111.54:8086/CTMPL/listProduct/${this.state.out_code}/${this.state.matchOutletCode}`
        let url = `https://api.docnet.id/CHCMasterE/CTMPL/listProduct/${this.state.out_code}/${this.state.matchOutletCode}`
        
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                out_code : this.state.out_code,
                buylcld_outcode : this.state.matchOutletCode
    
            })
            })
            .then(blob => blob.json() )
            .then((data) => {
                data = data.filter((v) => {
                    return v.pro_code !== '';
                });

                let newData = data
                this.setState({
                    produkData: newData
                });
    
            });
    }
    //untuk search
    retrieveSearchText = (text) => { 
  
        if(this.state.findBy ===1)//search by outlet code
        {
            let newData = this.state.outletData.filter((detail) => {
                return detail.out_Code.toLowerCase().indexOf(text) != -1;
            });  

            this.setState({
                outletData: text === "" ? this.state.outletDataInitialResult : newData
            });
    
        }    
        else  if(this.state.findBy == 2)//search by comco
        {
            let newData = this.state.outletData.filter((detail) => {
                return detail.out_comco.toLowerCase().indexOf(text) != -1;
            });

            this.setState({
                outletData: text === "" ? this.state.outletDataInitialResult : newData 
            });
        }  
        
        else  if(this.state.findBy == 3)//search by outlet name
        {
            let newData = this.state.outletData.filter((detail) => {
                return detail.out_Name.toLowerCase().indexOf(text) != -1;
            });

            this.setState({
                outletData: text === "" ? this.state.outletDataInitialResult : newData 
            });
        }  
    }

     //check all
     handleChecked =()=> {       

        //check all checkbox di table outlet
        var check = document.getElementsByName("checkbox")
        var all = document.getElementById("chkAll")       

        
        var b=0;       

        for (b=0;b<check.length;b++)
        {               
            
            if(all.checked === true)
            {
                check[b].checked = true;

            }
            else{
                check[b].checked = false;
            }        
            
            
        }       
    }

    //checked satu2
    handleCheckedSave=()=>{
        var checked = document.getElementsByName("checkbox")
        var all = document.getElementById("chkAll")
       
        
        //untuk check select all saat semua pilihan di check
        let count = 0
        for(var a = 0; a < checked.length ; a++)
        {
            if(checked[a].checked === true)
            {
                count = count + 1 
                console.log(checked[a].value) 
            }
        }

        if ( count === checked.length )
        {
            all.checked = true
        }
        else if (count !== checked.length)
        {
            all.checked = false
        }      
    }

    setSaveOutlet=()=>
    {
        let pro_code //procod
        let buylcld_supcode //no sup
        var check = document.getElementsByName("checkbox")
        let newData
        var data= []
        for(let a = 0;a < check.length ; a++)
        {
            if(check[a].checked === true)
            {               
                pro_code =check[a].value.slice(0,check[a].value.indexOf(","))
                buylcld_supcode = check[a].value.slice(check[a].value.indexOf(",")+1)

                newData = [{pro_code,buylcld_supcode}]
                
                data = data.concat(newData)            
            }            
        }

        console.log(data)
        //di tampung ke dalam array saveData
        this.setState({
            saveData : this.state.saveData.concat(data)
        },()=>
        {
            console.log(this.state.saveData)
        })    
    }

    saveData = ()  => {
        // var url = `http://10.0.111.54:8086/CopyTemplate`; 
        var url = `https://api.docnet.id/CHCMasterE/CopyTemplate`; 

        { this.state.saveData.map((detail) =>{

          
            let payload={
                buylcld_procod : detail.pro_code,
                buylcld_supcode : detail.buylcld_supcode,
                buylcld_outcode : this.state.out_code            
            }


            console.log(payload)
            fetch(url, {
                method: "POST",
                body: JSON.stringify(payload),
                json: true,
                headers :
                    {
                        "Content-type":"application/json; charset-UTF-8"
                    }
                })
                .then(response => {
                    if (response.ok) {
                        console.log("data inserted"); 
                                            
                    }
                });
                
            
        })};
        this.setState({
            saveVisible : true,
            saveData: []
        })
        this.toggleSaveOutlet();   
    }

    onDismiss=()=>{
        this.cancelOutlet();
    }
    cancelOutlet=()=>{
        document.getElementById("radio1").checked = false;
        document.getElementById("radio2").checked = false;
      
        this.componentDidMount();
        this.setState({
            outletData : [],
            outletDataInitialResult : [],
            matchOutletData : [],
            produkData : [],
            findBy: '',
            divisi : '', 
            value: '',
            out_code : '',
            out_comco : '',
            out_name : '',
            kota_name : '',
            out_citycode : '',
            matchOutletCode : '',
            saveVisible : false
        })
        
        
    }

    toggleFindOutlet=()=>{
        this.setState(prevState => ({
            findOutletModal: !prevState.findOutletModal
        }));
    }

    toggleSaveOutlet=()=>{
        this.setState(prevState => ({
            saveOutletModal: !prevState.saveOutletModal
        }));
    }

    toggleCancelOutlet=()=>{
        this.setState(prevState => ({
            cancelOutletModal: !prevState.cancelOutletModal
        }));
    }

    modalClose=()=>
    {
        this.setState({
            supplierModal : false,
            
        })
    }

    setDivisi=(divisi)=>{
        this.setState({
            divisi : divisi
        });
    }

    findBy=(kode)=>{
        this.setState({
            findBy : kode
        });
    }

    

    render(){
        
        return(
            <Page
            title="Copy Template Master Pembelian Lokal"
            breadcrumbs={[{ name: 'Copy Pembelian Lokal', active: true }]}
            className="Copy Pembelian Lokal"
            >
                <div>      
                    <div >
                        <FormGroup row style={{paddingLeft : 20}}>
                            <Label sm={2}>Divisi</Label>
                            <Col sm={10} style={{display : 'flex', paddingTop : 8}}>
                                <FormGroup check style={{paddingLeft : 30}}>
                                    <Label check>
                                        <Input type="radio" id ="radio1"name="radio1" onClick={()=> this.setDivisi(1)}/>{' '}
                                        APOTIK
                                    </Label>
                                    </FormGroup>
                                <FormGroup check style={{marginLeft : 50}}>
                                    <Label check>
                                        <Input type="radio" id ="radio2" name="radio1" onClick={()=> this.setDivisi(2)}/>{' '}
                                        FLOOR
                                    </Label>
                                </FormGroup>                       
                            </Col>                        
                        </FormGroup>
                        <FormGroup row style={{paddingLeft : 20} } >
                            <Label sm={2}>New Outlet</Label>
                            <Col sm={10} style={{display : 'flex'}}>
                                <Input  style={{width : '100px'}} disabled ={true} placeholder ={this.state.out_code}></Input>
                                {/* <Input  style={{width : '100px'}} disabled ={true} placeholder ={this.state.out_comco}></Input> */}
                                <Input style={{width : '500px'}} disabled ={true} placeholder ={this.state.out_name}></Input>
                                <Button color ="info" style={{background :"#349F9B", border : "#349F9B", marginLeft : 5}} onClick={()=> this.toggleFindOutlet()} disabled = {this.state.divisi === ''}>?</Button>
                                {/* <Input type="email" name="email" id="exampleEmail" placeholder={a} /> */}
                            </Col>
                        </FormGroup>

                        <FormGroup row style={{paddingLeft : 20}}>
                            <Label sm={2}>Kota</Label>
                                <Col sm={10} style={{display : 'flex'}}>
                                    <Input style={{width : '600px'}} disabled ={true} placeholder ={this.state.kota_name}></Input>                            
                                    {/* <Input type="email" name="email" id="exampleEmail" placeholder={a} /> */}
                                </Col>
                        </FormGroup> 
                        
                    </div>     
                

                <Modal size = 'lg'isOpen={this.state.findOutletModal} toggle={()=> this.toggleFindOutlet()} className={this.props.className} backdrop ={'static'} keyboard ={false}>
                    <ModalHeader toggle={()=> this.toggleFindOutlet()}>Find Outlet</ModalHeader>
                    <ModalBody>
                    <FormGroup row style={{paddingLeft : 20}}>
                        <Label sm={2}>Find By:</Label>
                        <Col sm={10} style={{display : 'flex', paddingTop : 8}}>
                        <FormGroup check style={{paddingLeft : 10}}>
                            <Label check>
                                <Input type="radio" name="radio1" onClick={()=> this.findBy(1)}/>{' '}
                                Outlet Code
                            </Label>
                            </FormGroup>

                            {/* <FormGroup check style={{marginLeft : 50}}>
                            <Label check>
                                <Input type="radio" name="radio1" onClick={()=> this.findBy(2)}/>{' '}
                                Comco
                            </Label>
                            </FormGroup>   */}

                            <FormGroup check style={{marginLeft : 50}}>
                            <Label check>
                                <Input type="radio" name="radio1" onClick={()=> this.findBy(3)}/>{' '}
                                Outlet Name
                            </Label>
                            </FormGroup>             
                        </Col>                
                        <SearchOutletPL findBy ={this.state.findBy} style={{width : '420px', marginLeft: 135}} getSearchText={this.retrieveSearchText}></SearchOutletPL>
                        {/* <Input  style={{width : '420px', marginLeft: 135}} disabled = {this.state.findBy === ''}></Input>         */}
                    </FormGroup>
                   

                        <Table bordered >
                            <thead style = {{textAlign: 'center'}}>
                                <tr>
                                    <th>Code</th>
                                    {/* <th>Comco</th> */}
                                    <th>Outlet Name</th>
                                    <th>Address</th>
                                    <th>City</th>
                                    <th>CityCode</th>
                                    <th>action</th>
                                </tr>
                            </thead>

                            {this.state.outletData.map((detail,index)=>{
                                return <tbody style = {{textAlign: 'center'}}>
                                        <tr key={index}>
                                            <td>{detail.out_Code}</td>
                                            {/* <td>{detail.out_comco}</td> */}
                                            <td>{detail.out_Name}</td>
                                            <td>{detail.out_Address}</td>
                                            <td>{detail.kota_Name}</td>
                                            <td>{detail.out_CityCode}</td>
                                            <td>
                                            <Button  size = 'sm' color="success" style={{background : "#349F9B", border:"#349F9B"}} onClick={()=>{this.getDetailOutlet(detail.out_Code, detail.out_Name, detail.kota_Name, detail.out_CityCode); this.toggleFindOutlet()}}>{this.props.buttonLabel}Select</Button>
                                            </td>
                                        </tr>                            
                                    </tbody>
                                })}
                        </Table> 
                    </ModalBody>
                </Modal>

                <h5 style = {{fontWeight:'bold', marginTop : 10, paddingLeft : 10}}>Match Outlet</h5>

                <Table bordered hover style = {{textAlign: 'center'}}>
                    <thead>
                        <tr>
                            <th>Kode</th>
                            <th>Comco</th>
                            <th>Nama Outlet</th>
                            <th>Alamat</th>
                            <th>Kota</th>
                            <th>Jumlah Procod</th>
                            <th>Action</th>

                        </tr>
                    </thead>
 
                    {this.state.matchOutletData.map((detail,index)=>{
                        return <tbody>
                                <tr key={index}>
                                    <td>{detail.out_code}</td>
                                    <td>{detail.out_comco}</td>
                                    <td>{detail.out_name}</td>
                                    <td>{detail.out_address}</td>
                                    <td>{detail.kota_name}</td>
                                    <td>{detail.jml_procod}</td>
                                    <td>
                                    <Button disabled = {this.state.Edit} size = 'sm' color="info" style={{background : "#349F9B", border:"#349F9B"}} onClick={()=>{this.getDetailMatchOutlet(detail.out_code)}}>{this.props.buttonLabel}Select</Button>
                    
                                    </td>
                                </tr>                            
                            </tbody>
                        })} 
                </Table> 
                      
                <h5 style = {{fontWeight:'bold', marginTop : 10, paddingLeft : 10}}>List Produk</h5>
                <Table bordered  hover >
                    <thead style = {{textAlign: 'center'}}>
                        <tr>
                            <th>Procode</th>
                            <th>Prodes</th>
                            <th>Con</th>
                            <th>NoSup</th>
                            <th>Nama Supplier</th>
                            <th>LgBupri</th>
                            <th>Disc</th>
                            <th>LnBupri</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    {this.state.produkData.map((detail,index)=>{
                        return <tbody style = {{textAlign: 'center'}}>
                                <tr key={index}>
                                    <td>{detail.pro_code}</td>
                                    <td>{detail.pro_name}</td>
                                    <td>{detail.pro_ctrlcode}</td>
                                    <td>{detail.buylcld_supcode}</td>
                                    <td>{detail.sup_name}</td>
                                    <td>{detail.buylclh_lgbupri}</td>
                                    <td>{detail.buylclh_disc}</td>
                                    <td>{detail.buylclh_lnbupri}</td>
                                    <td style ={{paddingLeft: 30, marginRight : 0}}>
                                        <Input type = "checkbox" name="checkbox" value ={detail.pro_code + ','+detail.buylcld_supcode}onChange={ ()=>this.handleCheckedSave() }></Input>
                                    </td>
                                </tr>                            
                            </tbody>
                        })}
                </Table>                 
                {   
                    !(this.state.produkData =="") && 
                    <div>
                        <FormGroup check>
                            <Label check >
                                <Input disabled ={this.state.produkData ==""} type="checkbox" id="chkAll" name="checkAll" onChange={ ()=>{this.handleChecked() }}  />{' '}
                                Select All
                            </Label>
                        </FormGroup> 
                    </div>

                }
                
                <Alert color="info" isOpen={this.state.saveVisible} toggle={()=>this.onDismiss()}>
                    Data inserted
                </Alert>
                
                <Row style = {{display: 'flex', justifyContent: 'center'}} >
                    <Button color ="primary"  disabled ={this.state.produkData ==""} size ="sm" style = {{background : "#349F9B", border:"#349F9B", marginLeft: '5px'}} onClick={()=> {this.toggleSaveOutlet(); this.setSaveOutlet()}}><TiDocumentAdd style={{width: 20, height: 20, paddingBottom : 2}}></TiDocumentAdd> Save</Button>
                    <Button color="secondary" disabled ={this.state.produkData ==""} size ="sm" style = {{background: "#F8A151", border: "#F8A151", marginLeft: '5px'}} onClick={()=> this.toggleCancelOutlet()}>Cancel</Button>
                </Row>

                
               

                <Modal isOpen={this.state.saveOutletModal} toggle={()=> this.toggleSaveOutlet()} className={this.props.className} backdrop ={'static'} keyboard ={false}>
                    <ModalHeader toggle={()=> this.toggleSaveOutlet()}>Save</ModalHeader>
                    <ModalBody>
                        Are you sure to save the data?                    
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary"   style={{background: "#349F9B", border:"#349F9B"}} onClick={()=> this.saveData()}>Save</Button>{' '}
                        <Button color="secondary" style={{background: "#F8A151", border: "#F8A151"}} onClick={()=>{this.toggleSaveOutlet();this.setState({saveData:[]})}}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.cancelOutletModal} toggle={()=> this.toggleCancelOutlet()} className={this.props.className} backdrop ={'static'} keyboard ={false}>
                    <ModalHeader toggle={()=> this.toggleCancelOutlet()}>Cancel</ModalHeader>
                    <ModalBody>
                        Are you sure to cancel all the data?                    
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary"   style={{background : "#349F9B", border:"#349F9B"}} onClick={()=> {this.cancelOutlet();this.toggleCancelOutlet();}}>Yes</Button>{' '}
                        <Button color="secondary" style={{background : "#F8A151", border: "#F8A151"}} onClick={()=>this.toggleCancelOutlet()}>No</Button>
                    </ModalFooter>
                </Modal>

            </div>

            </Page>
            
        )
    }
}



export default CopyPembelianLokal;