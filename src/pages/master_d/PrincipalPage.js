import Page from 'components/Page';
import React from 'react';
import {
    Button, Badge, Card, CardBody, CardHeader, Col, Row, Table, Modal,
    ModalBody, ModalFooter, ModalHeader, Input, Label, Nav, Form,
    Navbar,UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    ButtonGroup,InputGroup, InputGroupAddon, FormGroup,
} from 'reactstrap';
import 'react-tabs/style/react-tabs.css';
import { MdHighlightOff, MdCheckCircle, MdHighlight, MdAdd, MdDelete, MdSearch, MdEdit } from 'react-icons/md';
import PrincipalTab from './Principal/Principal_Tab';
class PrincipalPage extends React.Component {

    constructor(props) {
        super(props);
        this.state  = {
            result          : [],
            isLoading       : false,
            inputtedName    : '',
            selectedDropdown: "Show All",
            currentPage     : 1,
            todosPerPage    : 5,
            flag            : 0,
            pageCount       : 0,
            displayStatus   : "none",
            value           : 0,
            activeItemId    : "",
            groupStatus     : 1,
            flagDisabledApotek : true,
            flagDisabledFloor  : false
            
        };
    }

 
    connectionOut(message, render){
        console.log("masuk");
        if(render){
            this.setState({
                isLoading           : true,
                modal_backdrop      : false,
                modal_nested_parent : false,
                modal_nested        : false,
                backdrop            : true,
                modal_response      : true,
                modal_edit          : false,
                modal_confirm_edit  : false,
                searchType          : "Show_All",
                responseHeader      : "CONNECTION ERROR",
                responseMessage     : message
            },  () => this.getCountPage())
        }else{
            this.setState({
                isLoading           : true,
                modal_backdrop      : false,
                modal_nested_parent : false,
                modal_nested        : false,
                backdrop            : true,
                modal_response      : true,
                modal_edit          : false,
                modal_confirm_edit  : false,
                responseHeader      : "CONNECTION ERROR",
                responseMessage     : message
            })
        }
    }

    state = {
        isLoading : true,

    };

    componentDidMount() {
        this.setState.isLoading=true;
        this.getCountPage();
    }

    
    toggle = modalType => () => {

        if (!modalType) {
            return this.setState({
                modal: !this.state.modal,
            });
        }

        this.setState({
            [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        });
    };

    getCountPage(){
        console.log("todoperpage : "+this.state.todosPerPage);
        if(this.state.keyword!=null && this.state.keyword!=""){
            if (this.state.searchType==="Name"){
                console.log("dfds1" + this.state.todosPerPage)
                var payload = {
                    Name  : this.state.keyword,
                    Code  : "",
                    Limit : parseInt(this.state.todosPerPage),
                    Pri_Group : parseInt(this.state.groupStatus)
                }
            }
            else if (this.state.searchType==="Code"){
                console.log("dfds2" + this.state.todosPerPage)
                var payload = {
                    Name  : "",
                    Code  : this.state.keyword,
                    Limit : parseInt(this.state.todosPerPage),
                    Pri_Group : parseInt(this.state.groupStatus)
                }
            }
        }else{
            console.log("dfds3" + this.state.todosPerPage)
            var payload = {
                Name  : "",
                Code  : "",
                Limit : parseInt(this.state.todosPerPage),
                Pri_Group : parseInt(this.state.groupStatus)
            }
        }  
        var url     = `https://api.docnet.id/CHCMasterD/MasterPrincipal/HitungDataPrincipal`;

        fetch(url, {
            method : "POST",
            body   : JSON.stringify(payload),
            json   : true,
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(response => {
                console.log("bramodel : "+JSON.stringify(payload))
                console.log(response)       
                        if(response.Data === 0){
                            this.setState({ 
                                responseHeader  : "Warning",
                                responseMessage : "Data is empty",
                                modal_response  : true,
                                pageCount       : 1
                            });
                            console.log("masuk if response count=0");
                        }
                        
                        else{
                            console.log("response count : "+response.Data);
                            this.state.pageCount = response.Data;    
                            console.log("count pagecount: "+this.state.pageCount) 
                            this.getListbyPaging(this.state.currentPage,this.state.todosPerPage, this.state.isLoading = false);
                        }         
                                          
        }, ()=>  this.connectionOut("Can't reach the server", false), this.state.isLoading = true);
    }


    getListbyPaging(currPage,currLimit)
    {   
        this.state.isLoading = true ; 
        if (this.state.searchType==="Name"){
            var url     = `https://api.docnet.id/CHCMasterD/MasterPrincipal/CariNamaPrincipalPage`;
            var payload = {
                Pri_Name        : this.state.keyword,
                Pri_Group       : parseInt(this.state.groupStatus),
                Start           : parseInt(currPage),
                Length          : parseInt(currLimit),
            }
    
            fetch(url, {
                method : "POST",
                body   : JSON.stringify(payload),
                json   : true,
                headers:{
                         "Content-type": "application/json; charset=UTF-8"
                        }
                })
                .then(response => response.json())
                .then(data => {
                    if(data.Data === null)  {
                        console.log("data kosong")             
                        this.setState({ result: [], isLoading: false})
                        this.state.responseHeader  = "Warning";
                        this.state.responseMessage = "Nama tidak ada"; 
                        this.state.modal_response  = true;  
                    }
                    else{
                        console.log("data count : "+data.Data.length)
                        console.log("data tidak kosong")  
                        this.setState({ result: data.Data, isLoading: false})
                    }
                })
        }
        else if(this.state.searchType==="Code"){
            console.log(url);
            var url     = `https://api.docnet.id/CHCMasterD/MasterPrincipal/CariKodePrincipalPage`;
            var payload = {
                Pri_Code        : this.state.keyword,
                Pri_Group       : parseInt(this.state.groupStatus),
                Start           : parseInt(currPage),
                Length          : parseInt(currLimit),
            }
    
            fetch(url, {
                method : "POST",
                body   : JSON.stringify(payload),
                json   : true,
                headers: {
                     "Content-type": "application/json; charset=UTF-8"
                }
             })
            .then(response => response.json())
            .then(data => {
                if(data.Data === null)  {
                    console.log("data kosong")             
                    this.setState({ result: [], isLoading: false})
                    this.state.responseHeader  = "Warning";
                    this.state.responseMessage = "Kode tidak ada"; 
                    this.state.modal_response  = true;  
                }
                else{
                    console.log("data count : "+data.Data.length)
                    console.log("data tidak kosong")  
                    this.setState({ result: data.Data, isLoading: false})
                }
                
            }
        )}
        else{
            var payload = {
            Start   : parseInt(currPage),
            Length  : parseInt(currLimit),
            Pri_Group : parseInt(this.state.groupStatus) 
            };
            const option = {
                method  : "POST",
                json    : true,
                headers : {
                        "Content-Type": "application/json;charset=UTF-8"
                        },
                body: JSON.stringify(payload)
                }
                
                fetch("https://api.docnet.id/CHCMasterD/MasterPrincipal/TampilkanPrincipalPage",option)
                .then(response => response.json())
                .then(data =>{ 
                        if(data.Data === null)  {
                            console.log("data kosong")             
                            this.setState({ result: [], isLoading: false})
                            this.connectionOut("Can't reach the server", false)
                        }
                        else{
                            console.log("data tidak kosong")  
                            this.setState({ result: data.Data, isLoading: false})
                        }
                    });
            }
    }

    sendSearchParam = (keyword,currentPage,todosPerPage) => () =>{
        console.log("search : "+this.state.keyword);
        this.getCountPage();
        
    }


    updateSearchValue(evt){
        console.log(evt.target.value);
    
        this.setState({
            keyword: evt.target.value
        });
    }


    enterPressedSearch(event){
        console.log(this.state.currentPage)
        console.log(this.state.todosPerPage)
        var code = event.keyCode || event.which;
        if(code === 13){
            
            this.state.currentPage = 1;
            this.getCountPage();
        }
       
    }


    updateSelectionValue(evt){
        this.setState({
            [evt.target.name]: evt.target.value,
            selectedDropdown : evt.target.value
        });

        if(evt.target.value==="Code")
        {
            this.setState({
                searchType:"Code",
                displayStatus: 'inline-flex'
            })   
        }

        else if(evt.target.value==="Name")
        {
            this.setState({
                searchType:"Name",
                displayStatus: 'inline-flex'
            }) 
        }

        else if(evt.target.value === "Show All"){
            document.getElementById('inputSearch').value = "";
        
            this.setState({
                currentPage: 1,
                keyword: "",
                displayStatus: 'none'
            },() => {
            this.componentDidMount();
            });
        }
    }
    
    handleSelect(event) {
        this.setState({ [event.target.name]: event.target.value },() =>{
                this.state.currentPage = 1;
                this.getCountPage();
        });
    }
    
    handleWrite(event,flag) {
        console.log("karin : "+this.state.currentPage + flag)
        console.log("karin2 : "+Number(event.target.value))

        if((this.state.currentPage + flag) > 0){
            this.setState({
                currentPage: Number(event.target.value) + flag
            });
        }
        console.log("value event: "+ Number(event.target.value)+" "+(Number(event.target.value) + flag));
        
        if((this.state.currentPage + flag) > this.state.pageCount){
            this.setState({
                currentPage: this.state.pageCount
            });
            console.log("masuk sini1")
        }
        else{
            if(this.state.currentPage + flag != 0){
                this.getCountPage();
                console.log("masuk sini")
            }   
            console.log("value event: "+ (this.state.currentPage+flag)+" "+this.state.todosPerPage);
        }
      }

      
    handleFirst(event) {
        this.setState({
            currentPage: 1
        },() => this.getCountPage());
    }

    handleLast(event, page) {
        this.setState({
            currentPage: page
        },() => this.getCountPage());
    }

    showPage =()=>{
        this.getCountPage()
        this.setState({
            value:0
        })
    }

    showPrincipal = (id) =>{
        this.setState({
            value        : 1,
            activeItemId : id
        })
    }

    setGroupPrincipal = (statusID) =>{
        if(statusID == 1){
            this.setState({
                groupStatus : statusID,
                currentPage : 1,
                flagDisabledApotek : true,
                flagDisabledFloor  : false 
            },() => this.getCountPage());

        }
        else{
            this.setState({
                groupStatus : statusID,
                currentPage : 1,
                flagDisabledApotek : false,
                flagDisabledFloor  : true 
            },() => this.getCountPage());
        }
        
    }

    render() {
        const {result, value} = this.state;
        return (
            <Page 
                title       = "Principal"
                breadcrumbs = {[{ name: ' Principal', active: true }]}
                className   = "Principal">
                
                
                {value === 0 &&
                <Row >
                    <Modal
                        isOpen={this.state.modal_response}
                        toggle={this.toggle('response')}
                    >
                        <ModalHeader>
                            {this.state.responseHeader}
                        </ModalHeader>
                        <ModalBody>
                            {this.state.responseMessage}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="success" onClick={ () => { this.setState({ modal_response: false, modal_nested: false}) } }>OK</Button>
                        </ModalFooter>
                    </Modal>
                    <Col>
                    <Card  className = "mb-3">
                        <Form  inline
                                className="cr-search-form"
                                style={{
                                    textAlign:"center",
                                    justifyContent:"left",
                                    marginBottom: "20px"
                            }}>
                            <Button
                                color = "primary"
                                disabled = {this.state.flagDisabledApotek}
                                onClick = {()=>this.setGroupPrincipal(1)}
                                // style = {{
                                //     display: "inline-flex",
                                //     alignItems: "center",
                                //     float: "left",
                                //     width :"4vw" 
                                // }}
                                >
                                    Apotek
                            </Button>
                            <Button
                                color = "primary" 
                                disabled = {this.state.flagDisabledFloor}
                                onClick = {()=>this.setGroupPrincipal(2)}
                                // style = {{
                                //     display: "inline-flex",
                                //     alignItems: "center",
                                //     width :"4vw"
                                // }}
                                >
                                    Floor
                            </Button>
                        </Form> 
                        <CardHeader className = "d-flex justify-content-between">

                            <UncontrolledButtonDropdown
                            style={{
                                marginRight: "1.5vw"
                            }}
                            >
                                <DropdownToggle caret name = "filtermenu" color = "primary">
                                    {this.state.selectedDropdown}
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem value = "Show All" onClick = {evt => this.updateSelectionValue(evt)}>Show All</DropdownItem>
                                    <DropdownItem value = "Name" onClick = {evt => this.updateSelectionValue(evt)}>Name</DropdownItem>
                                    <DropdownItem value = "Code" onClick = {evt => this.updateSelectionValue(evt)}>Code</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledButtonDropdown>
                            
                           
                            
                            <Input
                                id          = "inputSearch"
                                type        = "search"
                                placeholder = "Search..."
                                onChange   = {evt => this.updateSearchValue(evt)}
                                onKeyPress = {evt => this.enterPressedSearch(evt)}
                                style={{
                                    display: this.state.displayStatus
                                }}
                            />
                            
                            <Button   
                                size = "sm" 
                                onClick = {this.sendSearchParam(this.state.keyword, this.state.currentPage, this.state.todosPerPage)}
                                style = {{
                                    marginRight: "1.5vw",
                                    display: this.state.displayStatus
                                }}>
                                <MdSearch size = "18"></MdSearch>
                            </Button>

                            <Button 
                                size = "sm" 
                                color = "primary" 
                                onClick = {()=>this.showPrincipal(-1)}
                                style = {{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    float: "right",
                                }}
                            >

                                <MdAdd 
                                style ={{
                                    marginRight: "5px"
                                }}>
                                </MdAdd>ADD
                                        
                            </Button>

                            </CardHeader>
                            <CardBody>
                                <Table
                                style={{
                                    marginTop: "15px"
                                }} 
                                responsive>
                                    <thead>
                                        <tr width = "100%">
                                        <th width = "20%">Kode</th>
                                        <th width = "70%">Nama</th>
                                        {/* <th>Alamat</th>
                                        <th>Kota</th> 
                                        <th>Kecamatan</th>
                                        <th>Kode Pos</th>
                                        <th>Telepon</th>
                                        <th>Fax</th> 
                                        <th>Penanggung Jawab</th>
                                        <th>EDLP</th>
                                        <th>Principal PIC</th>
                                        <th>Contact</th>
                                        <th>Dana Promosi</th>  */}
                                        <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.map(principal =>
                                            <tr>
                                                <th scope = "row" value={this.state.activeItemId}>{principal.Pri_Code}
                                                </th>
                                                <td value={this.state.activeItemName}>{principal.Pri_Name}</td>                                               
                                                {/* <td>{principal.Pri_Address}</td>
                                                <td>{principal.Pri_CityCode}</td>
                                                <td>{principal.Pri_KecID}</td>
                                                <td>{principal.Pri_PostalCode}</td>
                                                <td>{principal.Pri_TelpNumber}</td>
                                                <td>{principal.Pri_FaxNumber}</td>
                                                <td>{principal.Pri_Contact}</td>
                                                <td>{principal.Pri_EDLP}</td>
                                                <td>{"Principal PIC"}</td>
                                                <td>{"Contact Person"}</td>
                                                <td>
                                                    <tr>{principal.Pri_DPPercentage}{"%"}</tr>
                                                    <tr>{principal.Pri_DPValueRupiah}</tr>
                                                    {principal.Pri_DPPeriodStart} {principal.Pri_DPPeriodEnd}
                                                </td>
                                                 */}

                                                <td>
                                                    <Button size = "sm" color = "primary" style = {{display: "inline-flex", alignItems: "center"}}
                                                    onClick={()=>this.showPrincipal(principal.Pri_Code)}
                                                  >
                                                        <MdEdit style = {{marginRight: "7px"}}></MdEdit>Detail</Button>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </CardBody>

                            <InputGroup
                                style={{
                                    marginLeft:"1.5vw"
                                }}>
                                    <InputGroupAddon>Data per Page</InputGroupAddon>
                                    <select 
                                    name="todosPerPage"
                                    value={this.state.todosPerPage}
                                    onChange={(e) => this.handleSelect(e)}>
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                    </select>
                            </InputGroup>
                            
                            <br/>
                            
                            <Form
                                inline
                                className="cr-search-form"
                                style={{
                                    textAlign:"center",
                                    justifyContent:"center",
                                    marginBottom: "20px"
                            }}>
                                <Button
                                    value = {this.state.currentPage}
                                    onClick={(e) => this.handleFirst(e)}>First</Button>
                                <Button 
                                    value = {this.state.currentPage}
                                    onClick={(e) => this.handleWrite(e,-1)}>Prev</Button>
                                <Button
                                    disabled
                                    style={{width:'auto'}}
                                    color= "primary">
                                    {this.state.currentPage+" / "+this.state.pageCount}
                                </Button>

                                <Button
                                    value = {this.state.currentPage}
                                    onClick={(e) => this.handleWrite(e,1)}>Next</Button>

                                <Button 
                                    value = {this.state.currentPage} 
                                    onClick={(e) => this.handleLast(e,this.state.pageCount)}>Last</Button>
                             </Form>
                        </Card>
                    </Col>
                </Row>
                }

            {value === 1 && <Page> 
            <PrincipalTab  func = {()=>this.showPage()} activeItemId={this.state.activeItemId} groupStatus={this.state.groupStatus} />
            </Page>}
            
            </Page>
        );
    }


}
export default PrincipalPage;
