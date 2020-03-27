import Page from 'components/Page';
import React, { Component } from 'react';
import {Alert,Button, Col, Row, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label} from 'reactstrap';
import TableOutlet from './TableOutlet' 
import SearchOutlet from './SearchOutlet'

class JenisOutlet extends React.Component{
    
    constructor(props) {
        super(props);
        this.state = {
            result: [],
            isLoading: false,
            inputtedName: '',
            backdrop: true,
            initialResult: [],
            isAdd: false,
            newName: '',
            errorMassage: "",
            visible: false,
            isDelete : false,
            confirm : "",
            delData : '',
            saveVisible : false,
            delVisible : false
        };

        this.onDismiss = this.onDismiss.bind(this);


    }

    componentDidMount = () => {
        var url = `http://10.0.111.199:8090/masterJenisOutlet`;

        fetch(url)
        .then(blob => blob.json() )
        .then((data) => {
            data = data.filter((v) => {
                return v.jnsout_name !== '';
            });
            console.log(data);
            this.setState({
                result: data,
                initialResult: data
            });
        });
    }

    onDismiss() {
        this.setState({ visible: false });
        this.setState({newName : ""})
        this.setState({errorMassage :""})
      }

   
    addNewData = (param)  => {
       
        var url = `http://10.0.111.199:8090/MJenisOutletBaru`;
        // axios.({
        //     method : 'post',
        //     url : url
        // }).then(url=>console.log(url))
        // .catch(err=>console.log(err))
        var payload ={
            jnsout_name : param
        }
        console.log(url);

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

                    alert("data inserted");
                    this.setState({
                        saveVisible : true
                    })
                    
                    this.componentDidMount();
                }
            });
        
    }

    deleteData = (param)  => {

        console.log(this.state.confirm)
        var url = `http://10.0.111.199:8090/deleteJenisOutlet/${param}`;
        var payload ={
            jnsout_name : param
        }
        console.log(url);

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
                    this.setState({
                        delVisible : true
                    })
                    alert("data Deleted")
                }
            });

            this.toggleDel();
            this.setState({
                confirm : "",
                delData : ''
                })

    }


    toggle = () => {
        this.setState(prevState => ({
          modal: !prevState.modal
        }));
      }

    changeBackdrop = (e) => {
        let value = e.target.value;
        if (value !== 'static') {
            value = JSON.parse(value);
        }
        this.setState({ backdrop: value });
    }

    //Request to delete data here!

    //modal delete
    toggleDel = () => {
        this.setState(prevState => ({
          isDelete: !prevState.isDelete
        }));
      }

    confirmDelete=()=>
    {
        this.setState({confirm : "confirm"})
        
        console.log(this.state.confirm)
        if(this.state.confirm = "confirm" )
        {
            this.deleteData(this.state.delData);
            let newData = this.state.result.filter((v) => {
            //If return false, data will be filtered
            //If return true, data will be stayed
            return v.jnsout_Name != this.state.delData;
            
            });

            this.setState({
                result: newData,
                initialResult: this.state.initialResult.filter((v) => {
                    return v.jnsout_Name != this.state.delData;
                })
            });

        }
        else{
            console.log('delete Cancel')
        }
    }

  
    itemTableClick = (jnsout_Code) => {
      
        this.toggleDel();
        
        this.setState({delData: jnsout_Code})

        // if(this.state.confirm == 1 )
        // {
        //     this.deleteData(jnsout_Code);
        //     let newData = this.state.result.filter((v) => {
        //     //If return false, data will be filtered
        //     //If return true, data will be stayed
        //     return v.jnsout_Name != jnsout_Code;
            
        //     });

        //     this.setState({
        //         result: newData,
        //         initialResult: this.state.initialResult.filter((v) => {
        //             return v.jnsout_Name != jnsout_Code;
        //         })
        //     });

        // }
        // else{
        //     console.log('delete Cancel')
        // }
    }

    retrieveSearchText = (text) => {
        let newData = this.state.result.filter((v) => {
            return v.jnsout_Name.toLowerCase().indexOf(text) != -1;
        });

        this.setState({
            result: text === "" ? this.state.initialResult : newData
        });
    }

    createCsv = () => {
        let rows = [
            ['No.', 'Kode Outlet', 'Nama Jenis Outlet']
        ];

        this.state.result.forEach((v, i) => {
            rows.push([i+1, v.jnsout_Code, v.jnsout_Name]);
        });

        let csvContent = "data:text/csv;charset=utf-8," + rows.map(r => r.join(',')).join('\n');

        let uri = encodeURI(csvContent);
        
        let link = document.createElement('a');
        link.download = "outlet.csv";
        link.href = uri;
        link.click();

        this.toggle();
    }

    toggleAdd = () => {
        this.setState({
            isAdd: !this.state.isAdd
        });
    }
    
    // INI UNTUK TAMBAHIN DATA

     //untuk alert
     onDismiss() {
        this.setState({ visible: false });
        this.setState({newName : ""})
        this.setState({errorMassage :""})
      }
  
    validateAddData=()=>
    {
        //cek inputan lebih dari 30 karakter
        if(this.state.newName.length > 30)
        {
            this.setState({visible : true})
            this.setState({errorMassage : "Outlet Name must be under 30 characters"});
            return false;    
        }
        
        //cek ada angka dan symbol
        for(var a= 0; a< this.state.newName.length; a++)
        {
            //untuk cek angka dan symbol menggunakan kode ASCII
            if(!((this.state.newName.charCodeAt(a) >= 65 &&  this.state.newName.charCodeAt(a)<= 90) ||
                (this.state.newName.charCodeAt(a) >= 97 &&  this.state.newName.charCodeAt(a)<= 122) ||
                (this.state.newName.charCodeAt(a) == 32 )))
            {
                this.setState({visible : true});
                this.setState({errorMassage : "Outlet Name should not contain any Special Characters, Numeric or Symbols"});
                return false;
            }
        } 
        return true; 
        
        
    }
    addData = () => {

        const isValid =  this.validateAddData();
        if(isValid)
        {
            this.addNewData(this.state.newName)

            let newInitialData = this.state.initialResult;
            newInitialData.push({
                jnsout_Name: this.state.newName
                
            });
            //add data baru

            this.setState({
                result: newInitialData,
                initialResult: newInitialData
            }, () => {
                //Function callback for setState
                this.setState({
                    newName: ''
                }, () => {
                    this.toggleAdd();
                    this.componentDidMount();
                });
            });
        }
        else{
        }        
    }

    onDismissAdd=()=> {
        this.setState({
            saveVisible : false
        })
    }

    onDismissDel=()=>{
        this.setState({
            delVisible : false
        })
    }



    render(){
        return(
            <Page
                title="Jenis Outlet"
                breadcrumbs={[{ name: 'Jenis Outlet', active: true }]}
                className="JenisOutlet"
            >
                <Row>
                    <Col><SearchOutlet getSearchText={this.retrieveSearchText}></SearchOutlet>{' '}</Col>
                    <Col>
                        <Button color="success" onClick={() => this.toggleAdd()}>Add</Button>{' '}
                        <Button color="primary" onClick={this.toggle}>{this.props.buttonLabel}Print</Button>
                    </Col> 
                </Row>

                <TableOutlet data={this.state.result} onItemClick={this.itemTableClick} showAll={false}></TableOutlet>
                
                <Alert color="primary" isOpen={this.state.saveVisible} toggle={()=>this.onDismissAdd()}>
                    Data inserted
                </Alert>

                <Alert color="danger " isOpen={this.state.delVisible} toggle={()=>this.onDismissDel()}>
                    Data deleted
                </Alert>
                
                <Modal isOpen={this.state.isDelete} toggle={this.toggleDel} className={this.props.className}>
                    <ModalHeader>Delete Confirmation</ModalHeader>
                <ModalBody>Are you sure to delete this data?</ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={()=> this.confirmDelete()}>Delete</Button>{' '}
                        <Button color="secondary" onClick={this.toggleDel}>Cancel</Button>
                    </ModalFooter>
                </Modal> 
                
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} backdrop={this.state.backdrop}>
                    <ModalHeader toggle={this.toggle}>Preview</ModalHeader>
                    <ModalBody>
                        <TableOutlet data={this.state.result} showAll={true}></TableOutlet>
                    </ModalBody>

                    <ModalFooter>
                        <Button color="primary" disabled ={this.state.result == ''}onClick={() => this.createCsv()}>Print</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.isAdd} toggle={this.toggleAdd} className={this.props.className} backdrop={this.state.backdrop}>
                    <ModalHeader>Add Outlet</ModalHeader>
                    <ModalBody>                      
                        <Label>Outlet Name</Label>
                        <Input type="text" 
                        value={this.state.newName} 
                        placeholder="Outlet Name"
                        onChange={(e) => this.setState({newName: e.target.value})} /> 
                        <Alert color="danger" isOpen={this.state.visible} toggle={this.onDismiss}>
                            {this.state.errorMassage}
                        </Alert>                      
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" disabled={this.state.newName === ''} onClick={() => this.addData()}>Add</Button>
                        <Button color="primary" onClick={() => this.toggleAdd()}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                
            </Page>
        )
    }
}

export default JenisOutlet;