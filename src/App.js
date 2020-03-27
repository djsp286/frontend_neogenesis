import { STATE_LOGIN, STATE_FORGETPASS } from 'components/AuthForm';
import GAListener from 'components/GAListener';
import { EmptyLayout, LayoutRoute, MainLayout } from 'components/Layout';
import PrivateRoute from 'components/Layout/PrivateRoute';
import PageSpinner from 'components/PageSpinner';
import AuthPage from 'pages/template/AuthPage';
import ResetPasswordForm from 'components/ResetPasswordForm';
import React from 'react';
import componentQueries from 'react-component-queries';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import './styles/reduction.scss';
import * as firebase from "firebase/app";
import "firebase/performance";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBF7ptrdf9eU-2imtyk7nK_004VwgBsZcw",
  authDomain: "neo-genesis-development.firebaseapp.com",
  databaseURL: "https://neo-genesis-development.firebaseio.com",
  projectId: "neo-genesis-development",
  storageBucket: "",
  messagingSenderId: "24627510397",
  appId: "1:24627510397:web:5f1059eb90bbb2c5"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


// Initialize Performance Monitoring and get a reference to the service
//const perf = firebase.performance();

//MasterTest
const MasterTest = React.lazy(() => import('pages/master_test/master_test'));

//Master A
const DosageFormPage = React.lazy(() => import('pages/master_a/DossagePage'));
const KlasifikasiBPOMPage = React.lazy(() => import('pages/master_a/KlasifikasiBPOMPage'));
const StrengthPage = React.lazy(() => import('pages/master_a/StrengthPage'));
const GenerikPage = React.lazy(() => import('pages/master_a/GenerikPage'));
//Master B
const PackagePage = React.lazy(() => import('pages/master_b/PackagingPage'));
const UnitPage = React.lazy(() => import('pages/master_b/UnitPage'));
const DepartmentPage = React.lazy(() => import('pages/master_b/DepartmentPage'));
const DimensionPage = React.lazy(() => import('pages/master_b/DimensionPage'));
const KarakteristikPage = React.lazy(() => import('pages/master_b/CharacteristicPage'));
const PureDeadPage = React.lazy(() => import('pages/master_b/PureDeadPage'));
//Master C
const ProdukPage = React.lazy(() => import('pages/master_c/MasterProduk'));
const PointPage = React.lazy(() => import('pages/master_c/MasterPoint'));
const ScheduleHJAPage = React.lazy(() => import('pages/master_c/MasterScheduleHJA'));

//Master D
const BrandPage                 = React.lazy(() => import('pages/master_d/BrandPage'));
const GimmickSupplierPage       = React.lazy(() => import('pages/master_d/GimmickSupplierPage'));
const PrincipalPage             = React.lazy(() => import('pages/master_d/PrincipalPage'));
const SupplierPage              = React.lazy(() => import('pages/master_d/SupplierPage'));

//PurchaseOrder 
const Purchase_Order_Tab        = React.lazy(() => import('pages/purchase_order/Purchase_Order_Tab'));

//Master E
const BridgingSupplierKotaPage = React.lazy(() => import('pages/master_e/bridging_supplier_kota/BridgingSupplierKota'));
const CopyPembelianLokalPage = React.lazy(() => import('pages/master_e/copy_pembelian_lokal/CopyPembelianLokal'));
const PembelianLokalPage = React.lazy(() => import('pages/master_e/pembelian_lokal/PembelianLokal'));
//Master F
const ProductCounter = React.lazy(() => import('pages/master_f/ProductCounter'));
//Master G
const ReasonPage = React.lazy(() => import('pages/master_g/ReasonPage'));
const BiayaExpedisiPage = React.lazy(() => import('pages/master_g/BiayaExpedisiPage'));
const EkspedisiPage = React.lazy(() => import('pages/master_g/EkspedisiPage'));
const MinimalSp = React.lazy(() => import('pages/master_g/MinimalSp'));
const MobilPage = React.lazy(() => import('pages/master_g/MobilPage'));
const TitipanLuarKotaPage = React.lazy(() => import('pages/master_g/TitipanLuarKotaPage'));
const TitipanLuarKotaDetailPage = React.lazy(() => import('pages/master_g/TitipanLuarKotaDetailPage'));
const AddNewTitipanLuarKotaPage = React.lazy(() => import('pages/master_g/AddNewTitipanLuarKotaPage'));
//Master H
const OutletPage = React.lazy(() => import('pages/master_h/OutletPage'));
const OutletSchedulePage = React.lazy(() => import('pages/master_h/OutletSchedulePage'));
const OutletDataCameraPage = React.lazy(() => import('pages/master_h/OutletDataCameraPage'));
const OutletDataApotikPage = React.lazy(() => import('pages/master_h/OutletDataApotikPage'));
const OutletBusdevPage = React.lazy(() => import('pages/master_h/OutletBusdevPage'));
const OutletAccPajakPage = React.lazy(() => import('pages/master_h/OutletAccPajakPage'));
const OutletAccSupplierPage = React.lazy(() => import('pages/master_h/OutletAccSupplierPage'));
const OutletFInancePage = React.lazy(() => import('pages/master_h/OutletFInancePage'));
const ShiftPage = React.lazy(() => import('pages/master_h/ShiftPage'));
const JenisAreaPage = React.lazy(() => import('pages/master_h/JenisAreaPage'));
const GPLPage = React.lazy(() => import('pages/master_h/GPLPage'));
const JenisOutlet = React.lazy(() => import('pages/master_h/m_jenis_outlet/JenisOutlet'));
//Master I
const Diagnosa = React.lazy(() => import('pages/master_i/Diagnosa'));
const KategoriPrint = React.lazy(() => import('pages/master_i/KategoriPrint'));
const Solusi = React.lazy(() => import('pages/master_i/Solusi'));
const TCPenyakit = React.lazy(() => import('pages/master_i/TCPenyakit'));
const BridgingSick = React.lazy(() => import('pages/master_i/BridgingSick'));
const PICTCPrint = React.lazy(() => import('pages/master_i/PICTCPrint'));
//Master J
const TmpOutPage = React.lazy(() => import('pages/master_j/TmpOutPage'));
//Master_PO
const poOutStanding = React.lazy(() => import('pages/master_PO/Purchase_Order_OutStanding'));
//Template
const AlertPage = React.lazy(() => import('pages/template/AlertPage'));
const AuthModalPage = React.lazy(() => import('pages/template/AuthModalPage'));
const BadgePage = React.lazy(() => import('pages/template/BadgePage'));
const ButtonGroupPage = React.lazy(() => import('pages/template/ButtonGroupPage'));
const ButtonPage = React.lazy(() => import('pages/template/ButtonPage'));
const CardPage = React.lazy(() => import('pages/template/CardPage'));
const ChartPage = React.lazy(() => import('pages/template/ChartPage'));
const DashboardPage = React.lazy(() => import('pages/template/DashboardPage'));
const DropdownPage = React.lazy(() => import('pages/template/DropdownPage'));
const FormPage = React.lazy(() => import('pages/template/FormPage'));
const InputGroupPage = React.lazy(() => import('pages/template/InputGroupPage'));
const ModalPage = React.lazy(() => import('pages/template/ModalPage'));
const ProgressPage = React.lazy(() => import('pages/template/ProgressPage'));
const TablePage = React.lazy(() => import('pages/template/TablePage'));
const TypographyPage = React.lazy(() => import('pages/template/TypographyPage'));
const WidgetPage = React.lazy(() => import('pages/template/WidgetPage'));

const getBasename = () => {
  return `/${process.env.PUBLIC_URL.split('/').pop()}`;
};

class App extends React.Component {
  render() {
    return (
      <BrowserRouter basename={getBasename()}>
        <GAListener>
          <Switch>
            <LayoutRoute
              exact
              path="/login"
              layout={EmptyLayout}
              component={props => (
                <AuthPage {...props} authState={STATE_LOGIN} />
              )}
            />
            <LayoutRoute
              exact
              path="/lupapassword"
              layout={EmptyLayout}
              component={props => (
                <AuthPage {...props} authState={STATE_FORGETPASS} />
              )}
            />
            <PrivateRoute
              exact
              menuID="1"
              path="/resetpassword"
              layout={EmptyLayout}
              component={props => (
                //<ResetPWd>
                <ResetPasswordForm {...props} />
              )}

            />

            <MainLayout breakpoint={this.props.breakpoint}>
              <React.Suspense fallback={<PageSpinner />}>
                <PrivateRoute exact menuID="191" path="/" component={DashboardPage} />

                <PrivateRoute exact menuID="191" path="/master_test" component={MasterTest} />

                {/* Master A */}
                <PrivateRoute exact menuID="191" path="/klasifikasi-bpom" component={KlasifikasiBPOMPage} />
                <PrivateRoute exact menuID="191" path="/strength" component={StrengthPage} />
                <PrivateRoute exact menuID="191" path="/dosageform" component={DosageFormPage} />
                <PrivateRoute exact menuID="191" path="/generik" component={GenerikPage} />

                {/* Master B */}
                <PrivateRoute exact menuID="197" path="/kemasan" component={PackagePage} />
                <PrivateRoute exact menuID="266" path="/unit" component={UnitPage} />
                <PrivateRoute exact menuID="191" path="/departemen-produk" component={DepartmentPage} />
                <PrivateRoute exact menuID="341" path="/dimensi" component={DimensionPage} />
                {/* <PrivateRoute exact menuID="" path="/karakteristik" component={KarakteristikPage} /> */}
                <PrivateRoute exact menuID="240" path="/puredead" component={PureDeadPage} />
                {/* Master C */}
                <Route exact path="/confirm-schedule-hja" component={ScheduleHJAPage} />
                <Route exact path="/point" component={PointPage} />
                <Route exact path="/produk" component={ProdukPage} />
                { /*Master D*/}
                <PrivateRoute exact menuID="191" path="/brand" component={BrandPage} />
                <PrivateRoute exact menuID="191" path="/gimmick" component={GimmickSupplierPage} />
                <PrivateRoute exact menuID="191" path="/principal" component={PrincipalPage} />
                <PrivateRoute exact menuID="191" path="/supplier" component={SupplierPage} />
                
                {/* PurchaseOrder  */}
                <PrivateRoute exact menuID="191" path="/purchase_order" component={Purchase_Order_Tab} />
                
                {/* Master E */}
                <PrivateRoute exact menuID="191" path="/bridging-supplier-kota" component={BridgingSupplierKotaPage} />
                <PrivateRoute exact menuID="191" path="/copy-temp-beli-lokal" component={CopyPembelianLokalPage} />
                <PrivateRoute exact menuID="191" path="/pembelian-lokal" component={PembelianLokalPage} />
                {/* <PrivateRoute exact id="" path="/karakteristik" component={KarakteristikPage} /> */}
                {/* Master F */}
                <Route exact id="191" path="/product-counter" component={ProductCounter} />
                {/* Master G */}
                <Route exact path="/alasan" component={ReasonPage} />
                <Route exact path="/biaya-ekspedisi" component={BiayaExpedisiPage} />
                <Route exact path="/ekspedisi" component={EkspedisiPage} />
                <Route exact path="/minimal-sp" component={MinimalSp} />
                <Route exact path="/mobil" component={MobilPage} />
                <Route exact path="/titipan-luar-kota" component={TitipanLuarKotaPage} />
                <Route exact path="/titipan-luar-kota-detail" component={TitipanLuarKotaDetailPage} />
                <Route exact path="/tambah-titipan-luar-kota" component={AddNewTitipanLuarKotaPage} />
                {/* Master H */}
                <Route exact id="191" path="/shift-outlet" component={ShiftPage} />
                <Route exact id="191" path="/jenis-outlet" component={JenisOutlet} />
                <Route exact id="191" path="/group-pemilik-lokasi" component={GPLPage} />
                <Route exact id="191" path="/jenis-area" component={JenisAreaPage} />
                <Route exact id="191" path="/outlet" component={OutletPage} />
                <Route exact id="191" path="/outletschedule" component={OutletSchedulePage} />
                <Route exact id="191" path="/outletdatacamera" component={OutletDataCameraPage} />
                <Route exact id="191" path="/outletdataapotik" component={OutletDataApotikPage} />
                <Route exact id="191" path="/outletbusdev" component={OutletBusdevPage} />
                <Route exact id="191" path="/outletaccountingpajak" component={OutletAccPajakPage} />
                <Route exact id="191" path="/outletaccountingsupplier" component={OutletAccSupplierPage} />
                <Route exact id="191" path="/outletfinance" component={OutletFInancePage} />
                {/* Master I */}
                <Route exact id="191" path="/diagnosa" component={Diagnosa} />
                <Route exact id="191" path="/kategori-print" component={KategoriPrint} />
                <Route exact id="191" path="/solusi" component={Solusi} />
                <Route exact id="191" path="/tc-penyakit" component={TCPenyakit} />
                <Route exact id="191" path="/bridging-sick" component={BridgingSick} />
                <Route exact id="191" path="/pic-tc-print" component={PICTCPrint} />
                {/*Master_PO*/}
                <PrivateRoute exact menuID="191" path="/poOutStanding" component={poOutStanding} />
                {/* Master J */}
                <Route exact path="/template-alokasi-outlet" component={TmpOutPage} />
                {/* Template */}
                <PrivateRoute exact menuID="191" path="/login-modal" component={AuthModalPage} />
                <PrivateRoute exact menuID="191" path="/buttons" component={ButtonPage} />
                <PrivateRoute exact menuID="191" path="/cards" component={CardPage} />
                <PrivateRoute exact menuID="191" path="/widgets" component={WidgetPage} />
                <PrivateRoute exact menuID="191" path="/typography" component={TypographyPage} />
                <PrivateRoute exact menuID="191" path="/alerts" component={AlertPage} />
                <PrivateRoute exact menuID="191" path="/tables" component={TablePage} />
                <PrivateRoute exact menuID="191" path="/badges" component={BadgePage} />
                <PrivateRoute
                  exact
                  menuID=""
                  path="/buttoexact n-groups"
                  component={ButtonGroupPage}
                />
                <PrivateRoute exact menuID="191" path="/dropdowns" component={DropdownPage} />
                <PrivateRoute exact menuID="191" path="/progress" component={ProgressPage} />
                <PrivateRoute exact menuID="191" path="/modals" component={ModalPage} />
                <PrivateRoute exact menuID="191" path="/forms" component={FormPage} />
                <PrivateRoute exact menuID="191" path="/input-groups" component={InputGroupPage} />
                <PrivateRoute exact menuID="191" path="/charts" component={ChartPage} />
              </React.Suspense>
            </MainLayout>
            <Redirect to="/" />
          </Switch>
        </GAListener>
      </BrowserRouter>
    );
  }
}

const query = ({ width }) => {
  if (width < 575) {
    return { breakpoint: 'xs' };
  }

  if (576 < width && width < 767) {
    return { breakpoint: 'sm' };
  }

  if (768 < width && width < 991) {
    return { breakpoint: 'md' };
  }

  if (992 < width && width < 1199) {
    return { breakpoint: 'lg' };
  }

  if (width > 1200) {
    return { breakpoint: 'xl' };
  }

  return { breakpoint: 'xs' };
};

export default componentQueries(query)(App);