package example.zxing;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.Application;
import android.app.KeyguardManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.AssetManager;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.os.Handler;
import android.preference.PreferenceManager;
import android.provider.Settings;
import android.support.v7.widget.Toolbar;
import android.text.InputType;
import android.text.TextUtils;
import android.text.format.DateUtils;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TableLayout;
import android.widget.TextView;
import android.widget.Button;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonPrimitive;
import com.google.zxing.ResultPoint;
import com.google.zxing.client.android.BeepManager;
import com.journeyapps.barcodescanner.BarcodeCallback;
import com.journeyapps.barcodescanner.BarcodeResult;
import com.journeyapps.barcodescanner.DecoratedBarcodeView;
import com.retrofitintro.APIClient;
import com.retrofitintro.APIInterface;
import com.retrofitintro.Registro2;

import java.text.SimpleDateFormat;
import java.time.format.DateTimeParseException;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import com.nfc.obtenTag;
import com.tools.Offfiles;

import com.symbol.emdk.EMDKManager;
import com.symbol.emdk.EMDKResults;
import com.symbol.emdk.EMDKManager.EMDKListener;
import com.symbol.emdk.EMDKManager.FEATURE_TYPE;
import com.symbol.emdk.barcode.BarcodeManager;
import com.symbol.emdk.barcode.BarcodeManager.ConnectionState;
import com.symbol.emdk.barcode.BarcodeManager.ScannerConnectionListener;
import com.symbol.emdk.barcode.ScanDataCollection;
import com.symbol.emdk.barcode.Scanner;
import com.symbol.emdk.barcode.ScannerConfig;
import com.symbol.emdk.barcode.ScannerException;
import com.symbol.emdk.barcode.ScannerInfo;
import com.symbol.emdk.barcode.ScannerResults;
import com.symbol.emdk.barcode.ScanDataCollection.ScanData;
import com.symbol.emdk.barcode.Scanner.DataListener;
import com.symbol.emdk.barcode.Scanner.StatusListener;
import com.symbol.emdk.barcode.Scanner.TriggerType;
import com.symbol.emdk.barcode.StatusData.ScannerStates;
import com.symbol.emdk.barcode.StatusData;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import android.widget.Spinner;
import android.widget.CheckBox;
import android.content.pm.ActivityInfo;

import android.app.Activity;
import android.os.Bundle;
import android.text.Html;
import android.text.method.ScrollingMovementMethod;
import android.util.DisplayMetrics;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.CompoundButton.OnCheckedChangeListener;
import android.widget.ScrollView;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.AdapterView.OnItemSelectedListener;
import android.content.pm.ActivityInfo;
import android.support.v4.content.ContextCompat;
import java.util.Locale;

public class ContinuousCaptureActivity extends Activity implements EMDKListener, DataListener, StatusListener, ScannerConnectionListener, OnCheckedChangeListener {
private static final String TAG = ContinuousCaptureActivity.class.getSimpleName();
private DecoratedBarcodeView barcodeView;
private ImageView imageView;
private BeepManager beepManager;
private String lastText;
private Integer nu = 0;
private Integer iu00 = 0;

    private String[] urlsv;

    Application myApp;
    Context myContext;

    APIInterface apiServicio1;
    public String token1;
    public String token2;
    public String username2;
    public String password2;

    public String eventoId1;
    public String sectorId1;
    public String fechaFuncion1;
    public Integer nSectores;
    public Integer iSectores;
    private JsonObject listaSectores;
    private JsonArray lasfechas;
    public Integer contador = 0;
    public Integer vencimiento = 0;
    public TextView contadorTxT;

    private Integer jdni;
    private Integer ndni;

    private JsonObject ultimoQR;

    private LinearLayout lasEntradas;

    private Boolean habNfc = false;
    private AlertDialog mDialog;
    private obtenTag obtenTag1;
    private PendingIntent mPendingIntent;

    private String urlWS;
    private String urlWS2;

    private ScrollView scroll01;


    public String formato1;
    public String dni;
    private Registro2 ultimoRegistro;

    private String pref_scantipo;
    private String pref_mayores;


    private Boolean modoOl = true;

    private Offfiles guarda1;
    private Boolean modSy = false;

    public JsonObject nombreSector;


    public boolean blockBackButton = false;



    // zebra

    private EMDKManager emdkManager = null;
    private BarcodeManager barcodeManager = null;
    private Scanner scanner = null;

    // private EditText textViewData = null;
    // private TextView textViewStatus = null;

    private CheckBox checkBoxEAN8 = null;
    private CheckBox checkBoxEAN13 = null;
    private CheckBox checkBoxCode39 = null;
    private CheckBox checkBoxCode128 = null;

    private Spinner spinnerScannerDevices = null;

    private List<ScannerInfo> deviceList = null;

    private int scannerIndex = 0; // Keep the selected scanner
    private int defaultIndex = 0; // Keep the default scanner
    private int dataLength = 0;
    private String statusString = "";

    private boolean bSoftTriggerSelected = false;
    private boolean bDecoderSettingsChanged = false;
    private boolean bExtScannerDisconnected = false;
    private final Object lock = new Object();


    private int bkRed;
    private int bkYellow;
    private int bkGreen;
    private int bkBlue;


    private void initBarcodeManager(){
        barcodeManager = (BarcodeManager) emdkManager.getInstance(FEATURE_TYPE.BARCODE);
        // Add connection listener
        if (barcodeManager != null) {
            barcodeManager.addConnectionListener(this);
        }
    }

    private void initScanner() {
        if (scanner == null) {
            if ((deviceList != null) && (deviceList.size() != 0)) {
                if (barcodeManager != null)
                    scanner = barcodeManager.getDevice(deviceList.get(scannerIndex));
            }
            else {
                updateStatus("Failed to get the specified scanner device! Please close and restart the application.");
                return;
            }
            if (scanner != null) {
                scanner.addDataListener(this);
                scanner.addStatusListener(this);
                try {
                    scanner.enable();
                } catch (ScannerException e) {
                    updateStatus("error: " + e.getMessage());
                    deInitScanner();
                }
            }else{
                updateStatus("Failed to initialize the scanner device.");
            }
        }
    }


    private void enumerateScannerDevices() {
        if (barcodeManager != null) {
            List<String> friendlyNameList = new ArrayList<String>();
            int spinnerIndex = 0;
            deviceList = barcodeManager.getSupportedDevicesInfo();
            if ((deviceList != null) && (deviceList.size() != 0)) {
                Iterator<ScannerInfo> it = deviceList.iterator();
                while(it.hasNext()) {
                    ScannerInfo scnInfo = it.next();
                    friendlyNameList.add(scnInfo.getFriendlyName());
                    if(scnInfo.isDefaultScanner()) {
                        defaultIndex = spinnerIndex;
                    }
                    ++spinnerIndex;
                }
            }
            else {
                updateStatus("Failed to get the list of supported scanner devices! Please close and restart the application.");
            }
            ArrayAdapter<String> spinnerAdapter = new ArrayAdapter<String>(ContinuousCaptureActivity.this, android.R.layout.simple_spinner_item, friendlyNameList);
            spinnerAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
            spinnerScannerDevices.setAdapter(spinnerAdapter);
        }
    }


    private void setDefaultOrientation(){
        // no hay cambio de orientación
    }


    @Override
    public void onCheckedChanged(CompoundButton arg0, boolean arg1) {
        bDecoderSettingsChanged = true;
        cancelRead();
    }


    public void softScan(View view) {
        // bSoftTriggerSelected = true;
        // cancelRead();
        lasEntradas.removeAllViewsInLayout();
    }

    public void viewTicket(View view) {

        addTexto("ver...");

    }

    public void addTexto(String texto) {
        TextView valueTV = new TextView(myContext);
        valueTV.setText(texto);

        valueTV.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,ViewGroup.LayoutParams.WRAP_CONTENT));

        ((LinearLayout) lasEntradas).addView(valueTV);
        ((LinearLayout) lasEntradas).invalidate();
    }


    private void cancelRead(){
        if (scanner != null) {
            if (scanner.isReadPending()) {
                try {
                    scanner.cancelRead();
                } catch (ScannerException e) {
                    updateStatus("cancler " + e.getMessage());
                }
            }
        }
    }


    private void updateStatus(final String status){
        // Log.i("Ver.: status= ",status);
        /*
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                textViewStatus.setText("::" + status);
            }
        });

         */
    }


    private void onCreateZebra() {
        deviceList = new ArrayList<ScannerInfo>();

        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_NOSENSOR);
        setDefaultOrientation();

        // textViewData = (EditText)findViewById(R.id.textViewData);
        // textViewStatus = (TextView)findViewById(R.id.textViewStatus);

        checkBoxEAN8 = (CheckBox)findViewById(R.id.checkBoxEAN8);
        checkBoxEAN13 = (CheckBox)findViewById(R.id.checkBoxEAN13);
        checkBoxCode39 = (CheckBox)findViewById(R.id.checkBoxCode39);
        checkBoxCode128 = (CheckBox)findViewById(R.id.checkBoxCode128);
        spinnerScannerDevices = (Spinner)findViewById(R.id.spinnerScannerDevices);

        EMDKResults results = EMDKManager.getEMDKManager(getApplicationContext(), this);
        if (results.statusCode != EMDKResults.STATUS_CODE.SUCCESS) {
            updateStatus("EMDKManager object request failed!");
            return;
        }

        checkBoxEAN8.setOnCheckedChangeListener(this);
        checkBoxEAN13.setOnCheckedChangeListener(this);
        checkBoxCode39.setOnCheckedChangeListener(this);
        checkBoxCode128.setOnCheckedChangeListener(this);

        addSpinnerScannerDevicesListener();

        // textViewData.setSelected(true);
        // textViewData.setMovementMethod(new ScrollingMovementMethod());
    }

    private void deInitScanner() {
        if (scanner != null) {
            try{
                scanner.disable();
            } catch (Exception e) {
                updateStatus("init1 " + e.getMessage());
            }

            try {
                scanner.removeDataListener(this);
                scanner.removeStatusListener(this);
            } catch (Exception e) {
                updateStatus("init2 " + e.getMessage());
            }

            try{
                scanner.release();
            } catch (Exception e) {
                updateStatus("init3 " + e.getMessage());
            }
            scanner = null;
        }
    }

    private void addSpinnerScannerDevicesListener() {
        spinnerScannerDevices.setOnItemSelectedListener(new OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View arg1, int position, long arg3) {
                if ((scannerIndex != position) || (scanner==null)) {
                    scannerIndex = position;
                    bSoftTriggerSelected = false;
                    bExtScannerDisconnected = false;
                    deInitScanner();
                    initScanner();
                }
            }
            @Override
            public void onNothingSelected(AdapterView<?> arg0) {
            }
        });
    }


    @Override
    public void onOpened(EMDKManager emdkManager) {
        updateStatus("EMDK open success!");
        this.emdkManager = emdkManager;
        // Acquire the barcode manager resources
        initBarcodeManager();
        // Enumerate scanner devices
        enumerateScannerDevices();
        // Set default scanner
        spinnerScannerDevices.setSelection(defaultIndex);
    }

    @Override
    protected void onResume() {
        super.onResume();

        // The application is in foreground
        if (emdkManager != null) {
            // Acquire the barcode manager resources
            initBarcodeManager();
            // Enumerate scanner devices
            enumerateScannerDevices();
            // Set selected scanner
            spinnerScannerDevices.setSelection(scannerIndex);
            // Initialize scanner
            initScanner();
        }


        // barcodeView.resume();
        if (obtenTag1!=null) obtenTag1.onResume(this);
    }

    @Override
    public void onClosed() {
        Log.i("Ver:.", "onClosed ok");

        // Release all the resources
        if (emdkManager != null) {
            emdkManager.release();
            emdkManager = null;
        }
        updateStatus("EMDK closed unexpectedly! Please close and restart the application.");

    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        // Release all the resources
        if (emdkManager != null) {
            emdkManager.release();
            emdkManager = null;
        }
    }


    private void setDecoders() {
        if (scanner != null) {
            try {
                ScannerConfig config = scanner.getConfig();
                // Set EAN8
                config.decoderParams.ean8.enabled = checkBoxEAN8.isChecked();
                // Set EAN13
                config.decoderParams.ean13.enabled = checkBoxEAN13.isChecked();
                // Set Code39
                config.decoderParams.code39.enabled= checkBoxCode39.isChecked();
                //Set Code128
                config.decoderParams.code128.enabled = checkBoxCode128.isChecked();
                scanner.setConfig(config);
            } catch (ScannerException e) {
                updateStatus("error 2 " + e.getMessage());
            }
        }
    }


    @Override
    public void onStatus(StatusData statusData) {
        ScannerStates state = statusData.getState();
        switch(state) {
            case IDLE:
                statusString = statusData.getFriendlyName()+" is enabled and idle...";
                updateStatus("IDLE1: " + statusString);
                // set trigger type
                if(bSoftTriggerSelected) {
                    scanner.triggerType = TriggerType.SOFT_ONCE;
                    bSoftTriggerSelected = false;
                } else {
                    scanner.triggerType = TriggerType.HARD;
                }
                // set decoders
                if(bDecoderSettingsChanged) {
                    setDecoders();
                    bDecoderSettingsChanged = false;
                }
                // submit read
                if(!scanner.isReadPending() && !bExtScannerDisconnected) {
                    try {
                        scanner.read();
                    } catch (ScannerException e) {
                        updateStatus("IDLE:" + e.getMessage());
                    }
                }
                break;
            case WAITING:
                // statusString = "Scanner is waiting for trigger press...";
                updateStatus("waiting: " + statusString);
                break;
            case SCANNING:
                statusString = "Scanning...";
                updateStatus(statusString);
                break;
            case DISABLED:
                statusString = statusData.getFriendlyName()+" is disabled.";
                updateStatus(statusString);
                break;
            case ERROR:
                statusString = "An error has occurred.";
                updateStatus(statusString);
                break;
            default:
                break;
        }
    }


    @Override
    public void onConnectionChange(ScannerInfo scannerInfo, ConnectionState connectionState) {
        String status;
        String scannerName = "";
        String statusExtScanner = connectionState.toString();
        String scannerNameExtScanner = scannerInfo.getFriendlyName();
        if (deviceList.size() != 0) {
            scannerName = deviceList.get(scannerIndex).getFriendlyName();
        }
        if (scannerName.equalsIgnoreCase(scannerNameExtScanner)) {
            switch(connectionState) {
                case CONNECTED:
                    bSoftTriggerSelected = false;
                    synchronized (lock) {
                        initScanner();
                        bExtScannerDisconnected = false;
                    }
                    break;
                case DISCONNECTED:
                    bExtScannerDisconnected = true;
                    synchronized (lock) {
                        deInitScanner();
                    }
                    break;
            }
            status = scannerNameExtScanner + ":" + statusExtScanner;
            updateStatus("onConnect" + status);
        }
        else {
            bExtScannerDisconnected = false;
            status =  statusString + " " + scannerNameExtScanner + ":" + statusExtScanner;
            updateStatus("onConnect 2 " + status);
        }
    }
    @Override
    public void onData(ScanDataCollection scanDataCollection) {


        if ((scanDataCollection != null) && (scanDataCollection.getResult() == ScannerResults.SUCCESS)) {

            Log.i("Ver.: onData: ", " 2 " );

            ArrayList <ScanData> scanData = scanDataCollection.getScanData();

            Integer cnt = 0;
            String resultado = "";

            Integer size = scanData.size();
            ScanData data = null;
            // for(ScanData data : scanData) {
            for (cnt = 0; cnt < size; cnt++) {

                data = scanData.get(cnt);
                cnt++;


                Log.i("Ver.: onData: ", " index:  " + cnt.toString() + " " + data.getLabelType());
                // updateData("<font color='gray'>" + data.getLabelType() + "</font> : " + data.getData());
                resultado = data.getData();


                Log.i("Ver.: resultado: ", resultado);
                if (true) {

                    Log.i("Ver.: ", "pasa x aqui: ");
                    barcodeResultBuscarEnBase( resultado, "Scanner");

                    // textViewData.setText(resultado);
                }

            }


        }
    }

    private void updateData(final String result){
        // textViewData.setText(result);
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (result != null) {
                    if(dataLength ++ > 100) { //Clear the cache after 100 scans
                        // textViewData.setText("");
                        dataLength = 0;
                    }


                    /*
                    textViewData.append(Html.fromHtml(result));
                    textViewData.append("\n");
                    ((View) findViewById(R.id.scrollViewData)).post(new Runnable()
                    {
                        public void run()
                        {
                            ((ScrollView) findViewById(R.id.scrollViewData)).fullScroll(View.FOCUS_DOWN);
                        }
                    });
                    */


                }
            }
        });
    }



    @Override
    public boolean onCreateOptionsMenu(Menu menu)
    {
        getMenuInflater().inflate(R.menu.menu_scan,menu);
        return true;
    }



    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case R.id.action_sync:

                if (token2=="offline")
                {
                    guarda1.checkUsuarioWS(myApp,username2,password2,urlWS,"usuarioOk");
                }
                else
                {
                    iSectores = 0;
                    syncDump();
                }
                return true;

            case R.id.action_dni:

                ingresarDNI();

                return true;

            case R.id.action_delr:
                eliminarRegistros();
                return true;

            case R.id.action_syncr:
                syncRegistros();
                return true;

            case R.id.action_bloquear:
                String sblock = "sin bloquear";
                blockBackButton = !blockBackButton;
                if (blockBackButton) sblock = "bloqueada";

                barcodeView.setStatusText(sblock);
                guardarInicio();

                return true;

            case R.id.incrementar:
                contador++;
                guardarContador();
                return true;

            case R.id.decrementar:
                contador--;
                guardarContador();
                return true;

            case R.id.testEntrada:
                testEntrada();
                return true;

            default:
                return super.onOptionsItemSelected(item);
        }
    }


    /* ----------------------------- NFC INICIO ---------------------------------------- */
    public void initNFC()
    {

        mDialog = new AlertDialog.Builder(this).setNeutralButton("Ok", null).create();

        mPendingIntent = PendingIntent.getActivity(this, 0,new Intent(this, getClass()).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP), 0);
        obtenTag1 = new obtenTag(mPendingIntent);

        obtenTag1.setOnClickoEventListener(new obtenTag.OnClickoEventListener() {
            @Override
            public void onClicko(String tipo,String dato)
            {
                switch (tipo)
                {
                    case "error":
                        showMessage(R.string.error, R.string.no_nfc);
                        finish();
                        break;
                    case "finish":
                        finish();
                        break;
                    case "mensaje":
                        barcodeView.setStatusText(dato);
                        break;

                    case "encontro":
                        barcodeView.setStatusText(dato);
                        consultarNFC2(dato);
                        break;
                    case "startIntent":
                        Intent intent = new Intent(Settings.ACTION_WIRELESS_SETTINGS);


                        startActivity(intent);
                        break;
                }
            }
        });

        obtenTag1.init(this);
        obtenTag1.resolveIntent(getIntent(),this);

    }


    public void syncDump()
    {
        String[] separated;
        separated = sectorId1.split(",");
        nSectores = separated.length;
        barcodeView.setStatusText("Sincronizando... "+ String.valueOf(iSectores+1) + "/" + String.valueOf(nSectores));
        if (iSectores<nSectores)
        {
            guarda1.consultaDump(separated[iSectores],token2,urlWS);
        }
    }


    /* ----------------------------- GUARDAOFFLINE INICIO ---------------------------------------- */
    public void initOffline()
    {

        guarda1.setOnClickoEventListener(new Offfiles.OnClickoEventListener() {
            @Override
            public void onClicko(String tipo,String dato)
            {


                switch (tipo)
                {
                    case "usuarioError":
                        token2 = "offline";
                        showMessage2(R.string.error, dato);
                        break;
                    case "usuarioOk":
                        showMessage2(R.string.error,tipo +  " " +  dato);
                        token2 = dato;
                        iSectores = 0;
                        syncDump();
                        break;
                    case "usuarioOk2":
                        token2 = dato;
                        comenzarSyncReg();
                        break;

                    case "dumpOk":
                        iSectores++;
                        syncDump();
                        barcodeView.setStatusText("DUMP OK: " + dato + " Sectores: " + String.valueOf(iSectores)+"/"+String.valueOf(nSectores));
                        break;

                    case "mensaje":

                        barcodeView.setStatusText(dato);
                        break;

                    case "dumpError":
                        token2 = "offline";
                        barcodeView.setStatusText(dato);
                        break;

                    case "syncRegEnd":
                        barcodeView.setStatusText( "Registros Sincronizados: " + dato );
                        break;

                    case "inicioOK":
                        barcodeView.setStatusText( "Guardo inicio");
                        break;
                }
            }
        });


    }

    private void showMessage(int title, int message) {
        mDialog.setTitle(title);
        mDialog.setMessage(getText(message));
        mDialog.show();
    }

    private void showMessage2(int title, String message) {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Title");
        builder.setMessage(message);
    }



    private void eliminarRegistros()
    {
        showMessage3(1,"Ingrese el codigo para continuar");
    }

    private void syncRegistros()
    {
        showMessage3(2,"Ingrese el codigo para continuar");
    }

    private void ingresarDNI()
    {
        showMessage4(3,"Ingrese DNI");
    }

    private void testEntrada() {


    }


    private void showMessage3(final int title, String message) {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);

        if (title==1) builder.setTitle("Eliminar Regitros");
        if (title==2) builder.setTitle("Sincronizar Regitros");
        if (title==3) builder.setTitle("");
        builder.setMessage(message);

// Set up the input
final EditText input = new EditText(this);
// Specify the type of input expected; this, for example, sets the input as a password, and will mask the text
input.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
builder.setView(input);

// Set up the buttons

        builder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {


                String code1 = input.getText().toString();

                if (title==1)
                {
                    // eliminar registros

                    if (code1.equals("2257"))
                    {
                        String[] separated;
                        separated = sectorId1.split(",");
                        Integer i;
                        Integer n = separated.length;
                        Integer nreg,nreg2;
                        nreg2 = 0;
                        for (i=0;i<n;i++)
                        {
                            nreg = guarda1.eliminarRegistros(separated[i]);
                            nreg2 = nreg2 + nreg;
                        }

                        barcodeView.setStatusText( "Registros eliminados: " + String.valueOf(nreg2) );
                    }
                }


                if (title==2)
                {
                    // sincronizar registros
                    if (code1.equals("2257")) {

                        if (!TextUtils.isEmpty(token2))
                            if (token2.equals("offline"))
                            {
                                guarda1.checkUsuarioWS(myApp,username2,password2,urlWS,"usuarioOk2");
                            }
                            else
                            {
                                comenzarSyncReg();
                            }

                    }
                }

            }
        });
        builder.setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.cancel();
            }
        });

        builder.show();
    }







    private void showMessage4(final int title, String message) {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        if (title==3) builder.setTitle("");
        builder.setMessage(message);

        final EditText input = new EditText(this);
        input.setInputType(InputType.TYPE_CLASS_NUMBER | InputType.TYPE_TEXT_VARIATION_NORMAL);
        builder.setView(input);

        builder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {


                String code1 = input.getText().toString();

                if (title==3)
                {
                    // DNI INGRESADO
                    if (!code1.equals("")) {

                        String tipws = "ByDniEqualsAndFechaFuncion";
                        consultarPorDNI(code1,tipws);
                    }
                }

            }
        });
        builder.setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.cancel();
            }
        });

        builder.show();
    }




    public void comenzarSyncReg()
    {
        guarda1.sincronizarRegistros(sectorId1,urlWS,token2);
    }
    public void limpiarFnc(View view)
    {
        obtenTag1.clearTags();
    }



    @Override
    public void onNewIntent(Intent intent) {
        setIntent(intent);

        if (obtenTag1!=null)  obtenTag1.resolveIntent(getIntent(),this);
    }



    /* ----------------------------- NFC FIN ---------------------------------------- */








    public static void Add(JsonObject jo, String property, String[] values) {
        JsonArray array = new JsonArray();
        for (String value : values) {
            array.add(new JsonPrimitive(value));
        }

        jo.add(property, array);
    }

    public Registro2 getRegistraAcceso(JsonObject obj1)
    {
        Registro2 obj2 = new Registro2();

        obj2.Id = obj1.get("id").getAsInt();
        obj2.dni = obj1.get("dni").getAsString();
        obj2.estado = obj1.get("estado").getAsString();
        obj2.ingreso = "";

        obj2.idSector = obj1.get("sectorEventoId").getAsJsonObject().get("id").getAsString();

        Date lastModDate = new Date();
        android.text.format.DateFormat df = new android.text.format.DateFormat();

        String fecha = df.format("d/MM/yy", lastModDate).toString();
        String hora =  df.format("H:mm", lastModDate).toString();
        obj1.addProperty("fecha",fecha);
        obj1.addProperty("hora",hora);

        obj2.fecha = fecha;
        obj2.hora = hora;



        return obj2;
    }



    private JsonObject R2ToJson(Registro2 datos)
    {
        JsonObject obj1 = new JsonObject();

        obj1.addProperty("Id",datos.Id);
        obj1.addProperty("ingreso",datos.ingreso);
        obj1.addProperty("dni",datos.dni);
        obj1.addProperty("estado",datos.estado);

        obj1.addProperty("idSector",datos.idSector);

        Date lastModDate = new Date();
        android.text.format.DateFormat df = new android.text.format.DateFormat();
        String fecha = df.format("d/MM/yy", lastModDate).toString();
        String hora =  df.format("H:mm", lastModDate).toString();
        obj1.addProperty("fecha",fecha);
        obj1.addProperty("hora",hora);


        return obj1;
    }
    public void setRegistraAcceso(Registro2 datos, APIInterface apiServicio1, entrada00 entrada,String tipo) {


        if (tipo.equals("E"))
        {
            contador++;
            guardarContador();
        }


        if (!modoOl)
        {
            String datR = R2ToJson(datos).toString();

            guarda1.setRegistraAcceso(datos.dni,entrada.idSector, datR);
            String estado1 = entrada.estado;
            String s1 = "";


            if (tipo.equals("N"))
            {
                s1 = "INGRESO REGISTRADO CORRECTAMENTE";
                entrada.estado = "E";

            }

            if (tipo.equals("E"))
            {
                s1 = "SALIDA REGISTRADA CORRECTAMENTE";
                entrada.estado = "S";
            }

            if (tipo.equals("S"))
            {
                s1 = "REINGRESO REGISTRADO CORRECTAMENTE";
                entrada.estado = "E";
            }
            entrada.texto01 = s1;
            entrada.mostrarTextos();

        }
        else
        {
            setRegistraAccesoWS(datos,apiServicio1,entrada);
        }

    }


    public void setRegistraAccesoWS(Registro2 datos, APIInterface apiServicio1,final entrada00 entrada8)
    {
        Call<Void> call3 = apiServicio1.registraAcceso2(token1,datos);

        call3.enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {

                Integer cod1 = response.code();
                String s1 = "";
                String estado1;

                if (cod1==200) {

                    estado1 = entrada8.estado;

                    if (estado1.equals("N")) {

                        s1 = "INGRESO REGISTRADO CORRECTAMENTE";
                        entrada8.estado = "E";
                    }
                    if (estado1.equals("E")) {
                        s1 = "SALIDA REGISTRADA CORRECTAMENTE";
                        entrada8.estado = "S";
                    }

                    if (estado1.equals("S"))
                    {
                        s1 = "REINGRESO REGISTRADO CORRECTAMENTE";
                        entrada8.estado = "E";
                    }
                }
                else s1 = "ERROR CODE:" + cod1.toString();
                entrada8.texto01 = s1;
                entrada8.mostrarTextos();
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                call.cancel();
            }
        });
    }

/_
private void obtenerDatosEntrada(entrada00 entrada0, JsonObject obj1, Integer i, Integer n)
{
String fecha1;
String fecha2;
String fecha3;
fecha1 = obj1.get("sectorEventoId").getAsJsonObject().get("fechaFuncion").getAsString();
long dv = Long.valueOf(fecha1);// its need to be in milisecond
Date df = new java.util.Date(dv);
fecha2 = new SimpleDateFormat("yyyy-MM-dd hh:mm").format(df);
fecha3 = new SimpleDateFormat("yyyy-MM-dd").format(df);
String ingreso1 = obj1.get("ingreso").getAsString();
String dni = obj1.get("dni").getAsString();
String s2;
String etiqueta = obj1.get("ubicacionId").getAsJsonObject().get("etiqueta").getAsString();
String fila = obj1.get("ubicacionId").getAsJsonObject().get("fila").getAsString();
String sector = obj1.get("sectorEventoId").getAsJsonObject().get("sectorId").getAsJsonObject().get("nombre").getAsString();
String descuento = obj1.get("descuentoSectorId").getAsJsonObject().get("descripcion").getAsString();
String estado1 = ingreso1;
if (ingreso1.equals("E")) estado1 = "ADENTRO";
if (ingreso1.equals("S")) estado1 = "AFUERA";
entrada0.estado = ingreso1;
entrada0.texto02 = "DNI:" + dni + " - Fecha: " + fecha2 ;
entrada0.texto01 = estado1;
entrada0.texto03 = sector;
//modificaion acreditados
//entrada0.texto04 = descuento.toUpperCase() + " " + etiqueta + " - " + fila;
entrada0.texto04 = etiqueta + " - " + fila;
entrada0.mostrarTextos();
ultimoRegistro = getRegistraAcceso(obj1);
entrada0.datos = ultimoRegistro;
String eventoId0 = obj1.get("sectorEventoId").getAsJsonObject().get("eventoId").getAsJsonObject().get("id").getAsString();
String sectorEventoId0 = obj1.get("sectorEventoId").getAsJsonObject().get("id").getAsString();
entrada0.idSector = sectorEventoId0;
Boolean enSector = false;
String[] separated = sectorId1.split(",");
Integer n5;
Integer i5;
n5 = separated.length;
Boolean b5;
for (i5=0;i5<n5;i5++) {
b5 = sectorEventoId0.equals(separated[i5]);
enSector = (enSector || b5);
}
String desc2 = descuento.toLowerCase();
if ((eventoId0.equals(eventoId0)) && (enSector) && (fecha3.equals(fechaFuncion1))) {
if (desc2.startsWith("may")) {
entrada0.fondoInfo.setImageResource(R.drawable.bkverde);
} else {
entrada0.fondoInfo.setImageResource(R.drawable.bkamarillo);
}
if (n==1) mostrarOpciones(entrada0,ingreso1);
if (n>1)
{
if (pref_scantipo.equals("1"))
{
entrada0.setBoton("E",1);
entrada0.setBoton("S",0);
}
if (pref_scantipo.equals("2"))
{
entrada0.setBoton("E",0);
entrada0.setBoton("S",1);
}
}
if (pref_scantipo.equals("3"))
{
entrada0.setBoton("E",1);
entrada0.setBoton("S",1);
}
}
if (!(enSector)) {
String s3 = "";
if (!(fecha3.equals(fechaFuncion1))) {
s3 = "<br />Fecha de la entrada: " + fecha3;
}
entrada0.texto01 = "NO CORRESPONDE AL SECTOR";
entrada0.mostrarTextos();
entrada0.fondoInfo.setImageResource(R.drawable.bkrojo);
}
}
_/

    private void checkQRCODE(final String dato,final String tipws) {


        lasEntradas.removeAllViewsInLayout();
        scroll01.fullScroll(ScrollView.FOCUS_UP);

        iu00 = 0;

        Log.i(" encontró: ", dato);
        if (modoOl)
        {
            checkQRCODE_WS(dato,tipws);
        }
        else
        {
            checkQRCODE_Off(dato);
        }




    }


    private void checkQRCODE_Off(String dato)
    {
        String[] separated = sectorId1.split(",");
        Integer n5;
        Integer i5;
        Integer cant = 0;
        n5 = separated.length;
        JsonArray obj;



        for (i5=0;i5<n5;i5++) {

            String sec0 = separated[i5];
            String fecha3 = traeFechaSec(sec0);

            obj = guarda1.buscarUbicacion(sec0,dato,"qrCode");
            encontroDNI(obj, fecha3);
            cant = cant + obj.size();
        }
        barcodeView.setStatusText("QR: " + dato + " Encontrados: " + String.valueOf(cant));
    }


    private void checkQRCODE_WS(final String dato,String tipws)
    {

        checkQRCODE_WS_0(dato,tipws);

    }

    private void checkQRCODE_WS_0(final String dato,final String tipws)
    {
        // barcodeView.setStatusText("Consultando... " + dato  );
        //modificacion acreditados

        final String fecha3 = fechaFuncion1;


        String urls0 = urlsv[iu00];
        String token0 = "";

        token0 = traeToken(iu00);

        Log.i("Ver.: ",".............");
        Log.i("Ver.: ii0: ", iu00.toString() + " / " + nu.toString() );
        Log.i("Ver.: urls: ", urls0 );
        Log.i("Ver.: token0: ", token0);


        apiServicio1 = APIClient.conexionPaseSH(urls0).create(APIInterface.class);

        Call<JsonArray> call3 = apiServicio1.consultaQR(tipws, dato, token1,sectorId1 );
        call3.enqueue(new Callback<JsonArray>() {

            @Override
            public void onResponse(Call<JsonArray> call, Response<JsonArray> response)
            {
                Integer cod1 = response.code();

                Log.i("Ver.: onResponse ", cod1.toString());
                if (response.code() == 200)
                {


                    Integer nn2;
                    try
                    {
                        nn2 = response.body().size();

                        // barcodeView.setStatusText("QR:" + dato + " Encontrados: " + String.valueOf(nn2));

                        if (nn2>0)
                        {


                            for (int i=0;i<nn2;i++)
                            {
                                final entrada00 entrada0 =  new entrada00(myContext);


                                acciones(entrada0);
                                ultimoQR = response.body().get(i).getAsJsonObject();

                                final int i5 = i;
                                final int nn25 = nn2;

                                lasEntradas.addView(entrada0);


                                obtenerDatosEntradaDump(entrada0, ultimoQR, i5, nn25, fecha3);


                            }


                        }
                    }

                    catch(Exception e)
                    {
                        barcodeView.setStatusText("Error1:" + e.getMessage());
                    }



                }
                else
                {
                    barcodeView.setStatusText("Token:"+token1+" - WebService: " + cod1.toString() + " - Formato Scan:" + formato1 + " ");
                }

                if (iu00+1<nu)
                {
                    iu00++;
                    Log.i("Ver.: ","Seguir buscando...");
                    checkQRCODE_WS(dato,tipws);
                }

            }

            @Override
            public void onFailure(Call<JsonArray> call, Throwable t) {

                barcodeView.setStatusText(t.getMessage().toString());
                call.cancel();
            }


        });

    }







    private void consultarPorDNI(String dato,String tipws)
    {

        Log.i("Ver.: ", "entradas borradas");
        lasEntradas.removeAllViewsInLayout();
        // scroll01.fullScroll(ScrollView.FOCUS_UP);


        if (dato.equals("56457954")) dato = "25203079";
        if (dato.equals("11")) dato = "41847236";
        if (dato.equals("3577604049")) dato = "621275246";
        if (dato.equals("3577626138")) dato = "621507950";


        if (modoOl)
        {
            consultarPorDNI_ws(dato,tipws);
        }
        else
        {
            consultaPorDNI_Off(dato);
        }
    }


    private String traeFechaSec(String sect0)
    {
        String fecha2 = "";
        JsonArray valores;
        valores = listaSectores.get("id"+sect0).getAsJsonArray();
        Boolean b = valores.get(0).getAsBoolean();
        fecha2 = valores.get(2).getAsString();

        long dv = Long.valueOf(fecha2);// its need to be in milisecond
        Date df = new java.util.Date(dv);
        String fecha1 = new SimpleDateFormat("EEEE d 'de' MMMM", new Locale("es", "ES")).format(df);

        return fecha1;
    }


    private JsonObject traeDescSec(String sect0)
    {
        JsonObject descs;

        JsonArray valores;
        valores = listaSectores.get("id"+sect0).getAsJsonArray();

        descs = new JsonObject();

        if (valores.size()>2)
        {
            descs = valores.get(3).getAsJsonObject();
        }

        return descs;
    }




    private void consultaPorDNI_Off(String dato)
    {
        String[] separated = sectorId1.split(",");
        Integer n5;
        Integer i5;
        Integer cant = 0;
        n5 = separated.length;



        for (i5=0;i5<n5;i5++) {
            String sec0 = separated[i5];
            String fecha3 = traeFechaSec(sec0);

            JsonArray obj = guarda1.buscarUbicacion(sec0,dato,"dni");
            barcodeView.setStatusText("Sec:" +  sec0 + " dni:" + String.valueOf(obj.size()));
            encontroDNI(obj, fecha3);
            cant = cant + obj.size();
        }

        barcodeView.setStatusText("DNI:" +  dato + " Encontrados: " + String.valueOf(cant));

    }



    private void obtenerDatosEntradaDump(entrada00 entrada0,JsonObject obj1, Integer i, Integer n, String fecha3)
    {

        Log.i("Ver.: Entrada: ", obj1.toString());

        String etiqueta =  obj1.get("ubicacionId").getAsJsonObject().get("etiqueta").getAsString();
        String fila = obj1.get("ubicacionId").getAsJsonObject().get("fila").getAsString();
        JsonObject sectorEventoId = obj1.get("sectorEventoId").getAsJsonObject();
        JsonObject sectorId = sectorEventoId.get("sectorId").getAsJsonObject();

        String sector =  sectorEventoId.get("id").getAsString();
        Boolean isCampo = sectorId.get("campo").getAsBoolean();
        String nombreSectorNumerado = sectorId.get("nombre").getAsString();
        String sectorDescripcion = sectorEventoId.get("descripcion").getAsString();

        String fecha = "";
        String fecha1 = "";
        String fechaOk = "";
        String fechaYhora = "";
        int diff = 0;
        try
        {

            if (obj1.get("fechaIngreso") != null) {

                fecha =  obj1.get("fechaIngreso").getAsString();
                long dv = Long.valueOf(fecha);// its need to be in milisecond
                Date df = new java.util.Date(dv);
                fecha1 = new SimpleDateFormat("EEEE d 'de' MMMM", new Locale("es", "ES")).format(df);
                fechaOk = new SimpleDateFormat("EEEE d 'de' MMMM", new Locale("es", "ES")).format(df);
                fechaYhora = new SimpleDateFormat("EEE d | HH:mm", new Locale("es", "ES")).format(df);
                Date fecha0 = Calendar.getInstance().getTime();
                diff = (int) (fecha0.getTime() - df.getTime()) / 1000 / 60;
            }
        }
        catch (Exception e)
        {
            Log.i("Ver.: ", " error en fecha "+ e.getMessage());
        }

        entrada0.fechaIngreso = fechaYhora;

        Log.i("Ver.: ", obj1.toString());
        String descuento = "Mayores";
        try {
            descuento = obj1.get("descuentoSectorId").getAsJsonObject().get("descripcion").getAsString();
        }
        catch (Exception e) {

            Log.i("Ver.:", " error mayores ");
        }


        String etiquetaSector = "";
        try {
            etiquetaSector = sectorEventoId.get("etiquetaSector").getAsString();
        }
        catch (Exception e) {

        }



        String idDesc = obj1.get("descuentoSectorId").getAsJsonObject().get("id").getAsString();

        String ingreso1 = obj1.get("ingreso").getAsString();
        String dni = obj1.get("dni").getAsString();

        String nombre = "";

        JsonObject reservaId = obj1.get("reservaId").getAsJsonObject();

        try {
            nombre = reservaId.get("clienteId").getAsJsonObject().get("nombre").getAsString();
        } catch (Exception e) {
            nombre = "(sin nombre)";
        }

        //entradas y salidas
        JsonArray obj3 = guarda1.buscarDNI(dni,sector);
        Integer n2 = obj3.size();
        String ingresos = "";
        String Ids;
        String ing;
        String ids1 = ultimoQR.get("id").getAsString();
        String ingreso2 = ingreso1;
        String fing = "";
        String ing2 = "";
        if (n2>0)
        {
            for (Integer j=0;j<n2;j++) {
                String ss2 = obj3.get(j).getAsString();
                JsonParser parser = new JsonParser();
                JsonObject obj4 = parser.parse(ss2).getAsJsonObject();
                Ids = obj4.get("Id").getAsString();
                ing = obj4.get("ingreso").getAsString();
                fing = obj4.get("hora").getAsString();
                ing2 = ing;

                if (!fing.equals("")) ing2 = "["+ing +" "+ fing+"]";
                if (ids1.equals(Ids)) {
                    ingresos = ingresos + ing2;
                    ingreso2 = ing;
                }
            }
        }




        String s2;
        String estado1 = ingreso1;



        if (ingreso2.equals("E")) estado1 = "ADENTRO";
        if (ingreso2.equals("S")) estado1 = "AFUERA";



        String sectorNombre = "sin nombre";
        try {
            sectorNombre = nombreSector.get(sector).getAsString();
        }
        catch (Exception e) {
            Log.i("Ver.:", "error sector " + e.getMessage());
        }


        entrada0.estado = ingreso2;
        entrada0.dni = "DNI:" + dni;
        entrada0.nombre = nombre;
        entrada0.descuento = descuento;
        entrada0.fecha =  "Fecha:"  + fecha3.toUpperCase() ;
        entrada0.texto01 = "(" + ingreso1 + ") "+  ingresos + " " + estado1;
        entrada0.texto03 =  sectorNombre;

        int porcentaje = obj1.get("descuentoSectorId").getAsJsonObject().get("porcentaje").getAsInt();





        String ubicacion = etiquetaSector;

        if (etiquetaSector.isEmpty()) {
            ubicacion = sectorNombre;
        }

        //modificacion acreditados
        //entrada0.texto04 =  descuento.toUpperCase() + " " + etiqueta + " - " + fila;
        entrada0.texto04 =  etiqueta + " - " + fila + " D:" + idDesc;
        entrada0.ubicacion = ubicacion;
        // entrada0.sector = fila;
        entrada0.sector = isCampo ? "SECTOR NO NUMERADO": nombreSectorNumerado;

        entrada0.fecha = sectorDescripcion;
        entrada0.transaccion = "Transaccion: " + reservaId.get("id").getAsString();
        entrada0.idText = "ID: " + sector;



        entrada0.mostrarTextos();

        ultimoRegistro = getRegistraAcceso(obj1);

        entrada0.datos = ultimoRegistro;

        String eventoId0 = "100";
        String sectorEventoId0 = obj1.get("sectorEventoId").getAsJsonObject().get("id").getAsString();

        entrada0.idSector = sectorEventoId0;

        Boolean enSector = false;

        String[] separated = sectorId1.split(",");
        Integer n5;
        Integer i5;
        n5 = separated.length;
        Boolean b5;
        for (i5=0;i5<n5;i5++) {
            b5 = sectorEventoId0.equals(separated[i5]);
            enSector = (enSector || b5);
        }



        String desc2 = descuento.toLowerCase();

        if (pref_mayores.equals("2"))
        {
            try
            {
                JsonObject obDesc = traeDescSec(entrada0.idSector);
                JsonArray iddescA;

                iddescA = obDesc.get("id"+idDesc).getAsJsonArray();
                Boolean bb = iddescA.get(0).getAsBoolean();

                if (!bb) enSector = false;
            }
            catch (Exception e)
            {
                enSector = false;
            }

            //if (!desc2.startsWith("may")) enSector = false;
        }





        if (enSector) {
            if (desc2.startsWith("may")) {
                // se cambio funcionalidad de color
                //entrada0.fondoInfo.setImageResource(R.drawable.check_green);
                //entrada0.container.setBackgroundColor(bkGreen);
            } else {
                // se cambio funcionalidad de color
                // entrada0.fondoInfo.setImageResource(R.drawable.check_yellow);
                // entrada0.container.setBackgroundColor(bkYellow);
            }


            if (porcentaje != 0) {
                Log.i("Ver.: ", "amarillo");
                entrada0.fondoInfo.setImageResource(R.drawable.check_yellow);
                entrada0.container.setBackgroundColor(bkYellow);
            } else {
                Log.i("Ver.: ", "verde");
                entrada0.fondoInfo.setImageResource(R.drawable.check_green);
                entrada0.container.setBackgroundColor(bkGreen);
            }


            if (n==1) mostrarOpciones(entrada0,ingreso2, diff);
            if (n>1)
            {
                //continuo ingreso
                if (pref_scantipo.equals("1"))
                {
                    entrada0.setBoton("E",1);
                    entrada0.setBoton("S",0);
                }

                //continuo salida
                if (pref_scantipo.equals("2"))
                {
                    entrada0.setBoton("E",0);
                    entrada0.setBoton("S",1);
                }

                if (pref_scantipo.equals("4"))
                {
                    entrada0.setBoton("E",1);
                    entrada0.setBoton("S",1);
                }

            }


            if (pref_scantipo.equals("3"))
            {
                entrada0.setBoton("E",1);
                entrada0.setBoton("S",1);
            }
        }



        if (!(enSector)) {

            String s3 = "";
            if (!(fecha3.equals(fechaFuncion1))) {
                s3 = "<br />Fecha de la entrada: " + fecha3;
            }

            entrada0.texto01 = "NO CORRESPONDE AL SECTOR";

            entrada0.mostrarTextos();
            Log.i("Ver.: ", "rojo");
            entrada0.fondoInfo.setImageResource(R.drawable.check_red);
            entrada0.container.setBackgroundColor(bkRed);
        }


        Log.i("Ver.:", " datos obtenidos ...");


    }


    private void encontroDNI(JsonArray ss,String fecha3)
    {
        Integer n;
        Integer i;

        n = ss.size();
        entrada00 entrada0;
        Integer j;

        for (i=0;i<n;i++)
        {
            entrada0 = new entrada00(myApp);
            acciones(entrada0);
            lasEntradas.addView(entrada0);

            //try
            {
                ultimoQR = ss.get(i).getAsJsonObject();
                obtenerDatosEntradaDump(entrada0,ultimoQR, i, n,fecha3);
            }
        /* catch (Exception e)
            {
            entrada0.limpiarTextos();
            entrada0.texto01 = "Entrada (faltan datos) " + e.getMessage().toString();
            entrada0.mostrarTextos();
            entrada0.fondoInfo.setImageResource(R.drawable.bkrojo);
            }
            */
        }

    }


    private void consultarPorDNI_ws(String dato,String tipws)
    {
        String[] Sectores = sectorId1.split(",");

        Log.i("Ver.: LASFECHAS: ", listaSectores.toString() );

        lasfechas = new JsonArray();

        ndni = Sectores.length;
        jdni = 0;
        Integer i;

        for (i=0;i<ndni;i++)
        {
            String sect0 = Sectores[i];
            JsonArray valores;
            valores = listaSectores.get("id"+sect0).getAsJsonArray();
            Boolean b = valores.get(0).getAsBoolean();
            if (b) {
                String fecha2 = valores.get(2).getAsString();
                int p1 = Arrays.asList(lasfechas).indexOf(fecha2);
                if (p1<0)
                {
                    lasfechas.add(fecha2);
                    jdni++;
                }
            }
        }

        ndni = lasfechas.size();

        Log.i("Ver.: LASFECHAS: ", lasfechas.toString() );

        jdni = 0;
        iu00 = 0;
        consultarPorDNI_ws1(dato,tipws);
    }


    private void consultarPorDNI_ws1(String dato,String tipws)
    {

        if (jdni<ndni)
        {
            String fecha2;
            fecha2 = lasfechas.get(jdni).getAsString();

            long dv = Long.valueOf(fecha2);// its need to be in milisecond
            Date df = new java.util.Date(dv);
            String fecha1 = new SimpleDateFormat("EEEE d 'de' MMMM", new Locale("es", "ES")).format(df);

            jdni++;
            consultarPorDNI_ws0(dato, tipws,fecha1);
        }
        else
        {
            if (iu00+1<nu)
            {
                iu00++;
                jdni = 0;
                consultarPorDNI_ws1(dato,tipws);
            }
        }


    }



    private JsonArray traeDatosSector(String sect0) {
        JsonArray valores;
        valores = listaSectores.get("id" + sect0).getAsJsonArray();
        return valores;
    }


    public String traeToken(Integer iii)
    {
        String token0 = "";

        if (iii==0) token0 = token1;
        if (iii==1) token0 = token2;

        return token0;
    }
    private void consultarPorDNI_ws0(final String dato,final String tipws, final String fecha2)
    {
        barcodeView.setStatusText("Consultando dni: " + dato + "...");
        dni = dato;

        String fecha3 = fecha2.replace("-","/");

        String urls0 = urlsv[iu00];
        String token0 = "";

        token0 = traeToken(iu00);

        Log.i("Ver.: ",".............");
        Log.i("Ver.: ii0: ", iu00.toString() + " / " + nu.toString() );
        Log.i("Ver.: urls: ", urls0 );
        Log.i("Ver.: token0: ", token0);
        Log.i("Ver.: dni: ", dni);
        Log.i("Ver.: fecha: ", fecha3);


        apiServicio1 = APIClient.conexionPaseSH(urls0).create(APIInterface.class);
        Call<JsonArray> call3 = apiServicio1.consultaDNI(tipws,dni,fecha3,token0,sectorId1);
        call3.enqueue(new Callback<JsonArray>() {

            @Override
            public void onResponse(Call<JsonArray> call, Response<JsonArray> response) {
                Integer cod1 = response.code();

                Log.i("Ver.: CODE: ", cod1.toString() );

                if (response.code() == 200)
                {

                    Log.i("Ver.: Size: ",  String.valueOf(response.body().size()) );
                    encontroDNI(response.body(), fecha2);
                    barcodeView.setStatusText("DNI" + dato + " Encontrados: " + String.valueOf(response.body().size()));


                }
                else
                {
                    barcodeView.setStatusText("Error WS: " + cod1.toString() + " - Formato Scan:" + formato1 + " Token:"+token1);
                }

                consultarPorDNI_ws1(dato, tipws);

            }

            @Override
            public void onFailure(Call<JsonArray> call, Throwable t) {

                barcodeView.setStatusText("Error WS: " + t.getMessage().toString()  );
                call.cancel();
            }
        });
    }



    public void consultarNFC(String dato)
    {

//moficiacion acreditados
String tipws = "ByDniEqualsAndFechaFuncion";
consultarPorDNI(dato,tipws);
}

    public void consultarNFC2(String dato)
    {
        checkQRCODE(dato,"ByQRCode");

    }


    private void checkBAR(BarcodeResult result,String tipws)
    {
        String dato;
        dato = result.getText();
        consultarPorDNI(dato,tipws);
    }

    private void checkDNI(BarcodeResult result,String tipws)
    {
        String dato;
        dato = result.getText();
        String[] datov = dato.split("@");

        dni = datov[4];
        barcodeView.setStatusText("cambio: " + dni);
        consultarPorDNI(dni,tipws);
    }




    public void barcodeResultBuscarEnBase(String codigo, String formato) {
        Log.i("Ver.: ", " BUSCAR EN BASE");
        Log.i("Ver.: ", " formato " + formato);
        Log.i("Ver.: ", " codigo " + codigo);

        formato1 = formato;
        lastText = codigo;

        // barcodeView.setStatusText(codigo);
        // beepManager.playBeepSoundAndVibrate();

        String tipws = "";
        if (formato1=="PDF_417") tipws = "ByDniEqualsAndFechaFuncion";
        if (formato1=="QR_CODE") tipws = "ByQRCode";
        if (formato1=="CODE_39") tipws = "ByQRCode"; //modificaicon acreditados ByBAR
        if (formato1=="CODE_128") tipws = "ByQRCode"; //modificaicon acreditados ByBAR
        if (formato1=="Scanner") tipws = "ByQRCode";

        if (tipws=="ByQRCode")
        {
            checkQRCODE(codigo,tipws);
        }

    }



    private BarcodeCallback callback = new BarcodeCallback() {
        @Override
        public void barcodeResult(BarcodeResult result) {

            barcodeView.setStatusText("PASO POR AQUI 1" + formato1);

            if(result.getText() == null || result.getText().equals(lastText)) {
                // Prevent duplicate scans
                return;
            }


            formato1 = result.getBarcodeFormat().toString();
            lastText = result.getText();
            barcodeView.setStatusText(result.getText());
            beepManager.playBeepSoundAndVibrate();

            //Added preview of scanned barcode
            imageView = (ImageView) findViewById(R.id.barcodePreview);
            imageView.setImageBitmap(result.getBitmapWithResultPoints(Color.YELLOW));


            String tipws = "";
            if (formato1=="PDF_417") tipws = "ByDniEqualsAndFechaFuncion";
            if (formato1=="QR_CODE") tipws = "ByQRCode";
            if (formato1=="CODE_39") tipws = "ByQRCode"; //modificaicon acreditados ByBAR
            if (formato1=="CODE_128") tipws = "ByQRCode"; //modificaicon acreditados ByBAR


            if (tipws=="ByQRCode")
            {
                checkQRCODE(result.getText(),tipws);
            }


            if (tipws=="ByDniEqualsAndFechaFuncion")
            {
                checkDNI(result,tipws);
            }

            if (tipws=="ByBAR")
            {
                checkBAR(result,"ByDniEqualsAndFechaFuncion");
            }

            barcodeView.setStatusText("PASO POR AQUI 2" + formato1);


        }

        @Override
        public void possibleResultPoints(List<ResultPoint> resultPoints) {
        }
    };







    public void setAltura() {
        TableLayout t = (TableLayout) findViewById(R.id.principal);
        Integer h1 = t.getMeasuredHeight();

        ViewGroup.LayoutParams lp = scroll01.getLayoutParams();
        Integer ver = (h1 - 645 + 50);

        lp.height = 1120;
        scroll01.setLayoutParams(lp);

        Log.i("Ver.: h1: ", h1.toString() );
        Log.i("Ver.: altura: ", ver.toString() );

    }


    private void acciones(entrada00 entrada) {


        entrada.setOnClickE( new entrada00.OnClickoEE() {
            @Override
            public void onClickoE(LinearLayout view)
            {
                entrada00 entrada1 = (entrada00)view;

                barcodeView.resume();
                ultimoRegistro.ingreso = "E";
                entrada1.texto01 = "REGISTRAR INGRESO...";
                entrada1.mostrarTextos();
                ultimoRegistro.Id = entrada1.datos.Id;

                setRegistraAcceso(ultimoRegistro,apiServicio1,entrada1,"E");

            }
        });


        entrada.setOnClickS( new entrada00.OnClickoES() {
            @Override
            public void onClickoS(LinearLayout view)
            {
                entrada00 entrada1 = (entrada00)view;

                barcodeView.resume();
                ultimoRegistro.ingreso = "S";
                entrada1.texto01 = "REGISTRAR SALIDA...";
                entrada1.mostrarTextos();


                ultimoRegistro.Id = entrada1.datos.Id;

                setRegistraAcceso(ultimoRegistro,apiServicio1,entrada1,"S");
            }
        });



    }





    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {

        Boolean valor = true;

        if (blockBackButton) {
            if (!blockBackButton && keyCode == KeyEvent.KEYCODE_BACK)
                valor = super.onKeyDown(keyCode, event);
            else valor = true;
        }
        else
        {
            valor = super.onKeyDown(keyCode, event);
        }
        valor = barcodeView.onKeyDown(keyCode, event) || valor;

        return valor;

    }


    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);


        if (blockBackButton) {
            if (!hasFocus) {
                Intent closeDialog = new Intent(Intent.ACTION_CLOSE_SYSTEM_DIALOGS);
                sendBroadcast(closeDialog);
            }

        }

        // setAltura();
    }

    @Override
    protected void onUserLeaveHint() {

        if (blockBackButton) {
            startActivity(new Intent(ContinuousCaptureActivity.this, ContinuousCaptureActivity.class));
            finish();
            super.onUserLeaveHint();
            blockBackButton = true;
        }


    }

    private void disableLock() {

        KeyguardManager keyguardManager = (KeyguardManager) getSystemService(ContinuousCaptureActivity.KEYGUARD_SERVICE);
        KeyguardManager.KeyguardLock lock = keyguardManager.newKeyguardLock(KEYGUARD_SERVICE);

        lock.disableKeyguard();
    }



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        bkRed = ContextCompat.getColor(this, R.color.bkRed);
        bkYellow = ContextCompat.getColor(this, R.color.bkYellow);
        bkGreen = ContextCompat.getColor(this, R.color.bkGreen);
        bkBlue = ContextCompat.getColor(this, R.color.bkBlue);


        setContentView(R.layout.continuous_scan);

        myApp = this.getApplication();
        myContext = this;

        barcodeView = (DecoratedBarcodeView) findViewById(R.id.barcode_scanner);
        lasEntradas = (LinearLayout) findViewById(R.id.entradasAqui);
        scroll01 = (ScrollView) findViewById(R.id.scroll01);

        contadorTxT = findViewById(R.id.contador);

        AssetManager asset1 = getAssets();
        guarda1 = new Offfiles();
        guarda1.init(this);
        barcodeView.decodeContinuous(callback);
        beepManager = new BeepManager(this);

        eventoId1 = ((SampleApplication) myApp).getEventoId();

        urlsv = ((SampleApplication) myApp).getURLWSV();
        nu = ((SampleApplication) myApp).getURLWSN();

        if (eventoId1==null) cargaVariablesNull();
        else cargaVariables();

        JsonObject datosIni;
        datosIni = guarda1.traeInit();
        blockBackButton = datosIni.get("blockBackButton").getAsBoolean();

        if (modoOl) apiServicio1 = APIClient.conexionPaseSH(urlWS).create(APIInterface.class);
        if (habNfc) initNFC();
        initOffline();

        guardarInicio();

        SharedPreferences pref = PreferenceManager.getDefaultSharedPreferences( myApp );

        contador = Integer.parseInt(pref.getString("pref_contador", "0"));
        vencimiento = Integer.parseInt(pref.getString("pref_vencimiento", "0"));

        contadorTxT.setText( "onCreate: " +  contador.toString() );

        Log.i("Ver.:", "on create zebra ");
        onCreateZebra();

        setAltura();

    }


    public void guardarContador()
    {
        SharedPreferences pref = PreferenceManager.getDefaultSharedPreferences( myApp );
        contadorTxT.setText( contador.toString() );

        SharedPreferences.Editor editor = pref.edit();
        editor.putString("pref_contador", contador.toString());
        editor.commit();
    }


    public void cargaVariablesNull()
    {

        JsonObject datosIni;
        datosIni = guarda1.traeInit();
        eventoId1 = datosIni.get("eventoId1").getAsString();

        fechaFuncion1 = datosIni.get("fechaFuncion1").getAsString();

        Log.i("Ver.: 2", "fechaFuncion1: "+ fechaFuncion1);

        sectorId1 = datosIni.get("sectorId1").getAsString();
        blockBackButton = datosIni.get("blockBackButton").getAsBoolean();
        token1 = datosIni.get("token1").getAsString();
        username2 = datosIni.get("username2").getAsString();
        password2 = datosIni.get("password2").getAsString();
        urlWS = datosIni.get("urlWS").getAsString();
        pref_scantipo = datosIni.get("pref_scantipo").getAsString();
        pref_mayores = datosIni.get("pref_mayores").getAsString();

        habNfc = datosIni.get("habNfc").getAsBoolean();
        modoOl = datosIni.get("modoOl").getAsBoolean();
        modSy = datosIni.get("modSy").getAsBoolean();

        try
        {
            token1 = datosIni.get("token1").getAsString();
            token2 = datosIni.get("token2").getAsString();
        }
        catch (Exception e)
        {

        }

        String urlsvs = datosIni.get("urlsv" ).getAsString();
        urlsv = TextUtils.split(urlsvs,",");

        nu = datosIni.get("nu").getAsInt();


        Log.i("Ver.: urlsv.... " , urlsv.toString() );
        JsonParser parser = new JsonParser();

        String listaSectoresSS = datosIni.get("listaSectores").getAsString();
        listaSectores = parser.parse(listaSectoresSS).getAsJsonObject();

        String nombreSectors = datosIni.get("nombreSector").getAsString();
        nombreSector = parser.parse(nombreSectors).getAsJsonObject();
        barcodeView.setStatusText("EventoId: " + eventoId1 + "  Fecha: " + fechaFuncion1 + " Sector: " + sectorId1);


        String scanTypeDescription;
        switch (pref_scantipo) {
            case "1":
                scanTypeDescription = "Continuo Ingreso";
                break;
            case "2":
                scanTypeDescription = "Continuo Salida";
                break;
            case "3":
                scanTypeDescription = "Preguntar";
                break;
            case "4":
                scanTypeDescription = "Continuo Ingreso y Salida";
                break;
            default:
                scanTypeDescription = "Desconocido";
                break;
        }

        setTitle( scanTypeDescription);

    }

    public void cargaVariables()
    {

        String nombreEvento = "";
        try {
            token1 = ((SampleApplication) myApp).getTokenUser();
            token2 = ((SampleApplication) myApp).getTokenUser2();

            eventoId1 = ((SampleApplication) myApp).getEventoId();
            fechaFuncion1 = ((SampleApplication) myApp).getFechaFuncion();

            Log.i("Ver.: 1", "fechaFuncion1: "+ fechaFuncion1);

            nombreEvento = ((SampleApplication) myApp).getEventoName();
            sectorId1 = ((SampleApplication) myApp).getsectorId();
            listaSectores = ((SampleApplication) myApp).getsectorCId();

            username2 = ((SampleApplication) myApp).getusername2();
            password2 = ((SampleApplication) myApp).getpassword2();
            nombreSector = ((SampleApplication) myApp).getsectorNombres();

            if (fechaFuncion1!=null) {
                long dv = Long.valueOf(fechaFuncion1);// its need to be in milisecond
                Date df = new java.util.Date(dv);
                fechaFuncion1 = new SimpleDateFormat("EEEE d 'de' MMMM", new Locale("es", "ES")).format(df);
            }

        }
        catch(Exception e)
        {
            barcodeView.setStatusText("Error: " + e.getMessage().toString());
        }

        SharedPreferences pref = PreferenceManager.getDefaultSharedPreferences( myApp );

        urlWS = pref.getString("pref_urlws", "");
        urlWS2 = pref.getString("pref_urlws2", "");
        Boolean ip1 = pref.getBoolean("ip1",true);
        Boolean ip2 = pref.getBoolean("ip2",true);

        if (!ip1 && ip2)
        {
            urlWS = urlWS2;
        }

        /*
        Log.i("Ver.: url1: ", urlWS);
        Log.i("Ver.: ip1:  ", ip1.toString());

        Log.i("Ver.: url2: ", urlWS2);
        Log.i("Ver.: ip2:  ", ip2.toString());
        Log.i("Ver.: contador:  ", contador.toString());
        */


        pref_scantipo = pref.getString("pref_scantipo", "");
        pref_mayores = pref.getString("pref_mayores","");

        habNfc = pref.getBoolean("pref_nfc",false);
        modoOl = pref.getBoolean("pref_online",true);
        modSy = pref.getBoolean("pref_sync",false);
        token1 = ((SampleApplication) myApp).getTokenUser();

        String scanTypeDescription;
        switch (pref_scantipo) {
            case "1":
                scanTypeDescription = "Continuo Ingreso";
                break;
            case "2":
                scanTypeDescription = "Continuo Salida";
                break;
            case "3":
                scanTypeDescription = "Preguntar";
                break;
            case "4":
                scanTypeDescription = "Continuo Ingreso y Salida";
                break;
            default:
                scanTypeDescription = "Desconocido";
                break;
        }


        setTitle(nombreEvento + "/" + scanTypeDescription);

        barcodeView.setStatusText("EventoId: " + eventoId1 + "  Fecha: " + fechaFuncion1 + " Sector: " + sectorId1);
    }

    public void guardarInicio()
    {
        JsonObject datosIni;
        datosIni = new JsonObject();
        datosIni.addProperty("eventoId1",eventoId1);
        datosIni.addProperty("fechaFuncion1",fechaFuncion1);
        datosIni.addProperty("sectorId1",sectorId1);
        datosIni.addProperty("blockBackButton",blockBackButton);
        datosIni.addProperty("token1",token1);
        datosIni.addProperty("username2",username2);
        datosIni.addProperty("password2",password2);
        datosIni.addProperty("urlWS",urlWS);
        datosIni.addProperty("pref_scantipo",pref_scantipo);

        datosIni.addProperty("token1", token1);
        datosIni.addProperty("token2", token2);

        datosIni.addProperty("pref_mayores",pref_mayores);

        datosIni.addProperty("habNfc",habNfc);
        datosIni.addProperty("modoOl",modoOl);
        datosIni.addProperty("modSy",modSy);
        datosIni.addProperty("listaSectores", listaSectores.toString());


        if (urlsv!=null)
        {
            String urlsvs = TextUtils.join(",", urlsv);

            Log.i("Ver.: urlsv: ", urlsvs );
            Log.i("Ver.: nu: ", nu.toString() );

            datosIni.addProperty("urlsv", urlsvs );
            datosIni.addProperty("nu",nu);
        }



        String nombreSectors = nombreSector.getAsJsonObject().toString();
        datosIni.addProperty("nombreSector", nombreSectors );

        guarda1.guardarInit(datosIni);
    }


    private void deInitBarcodeManager(){
        if (emdkManager != null) {
            emdkManager.release(FEATURE_TYPE.BARCODE);
        }
    }


    @Override
    protected void onPause() {
        super.onPause();

        // The application is in background
        // Release the barcode manager resources
        deInitScanner();
        deInitBarcodeManager();

        // barcodeView.pause();
        if (obtenTag1!=null) obtenTag1.onPause(this);
    }

    public void pause(View view) {
        barcodeView.pause();
    }

    public void resume(View view) {
        barcodeView.resume();
    }


    public void salir(View view)
    {
        this.finish();
    }


    public void triggerScan(View view) {
        barcodeView.decodeSingle(callback);
    }





    private void mostrarOpciones(entrada00 entrada1,String ingreso, int diff)
    {

        Boolean permitir = false;

        if (pref_scantipo.equals("1")) // CONTINUO INGRESO
        {

            if (vencimiento>0)
            {
                if (diff>vencimiento) permitir = true;
            }


            if (ingreso.equals("E") && !permitir)
            {
                entrada1.texto01 = "ESTA PERSONA YA ESTABA ADENTRO ";
                entrada1.mostrarTextos();

                entrada1.fondoInfo.setImageResource(R.drawable.check_red);
                entrada1.container.setBackgroundColor(bkRed);
                // se cambio funcionalidad de color
                //

            }
            else
            {
                if (permitir)
                {
                    entrada1.texto00 = "Ultimo ingreso hace "+diff+" minutos | " + entrada1.texto00;
                    entrada1.mostrarTextos();
                }
                ultimoRegistro.ingreso = "E";
                setRegistraAcceso(ultimoRegistro,apiServicio1,entrada1,"E");
            }
        }


        if (pref_scantipo.equals("2")) // CONTINUO SALIDA
        {
            if (ingreso.equals("S"))
            {
                entrada1.texto01 = "ESTA PERSONA YA ESTABA AFUERA";
                entrada1.mostrarTextos();

                // se cambio funcionalidad de color
                entrada1.fondoInfo.setImageResource(R.drawable.check_red);
                entrada1.container.setBackgroundColor(bkRed);
            }
            else {
                ultimoRegistro.ingreso = "S";
                setRegistraAcceso(ultimoRegistro, apiServicio1,entrada1,"S");

                entrada1.fondoInfo.setImageResource(R.drawable.check_blue);
                entrada1.container.setBackgroundColor(bkBlue);
            }
        }


        if (pref_scantipo.equals("4"))  // CONTINUO INGRESO Y SALIDA
        {
            if (ingreso.equals("S"))
            {
                ultimoRegistro.ingreso = "E";
                setRegistraAcceso(ultimoRegistro, apiServicio1,entrada1,"E");
            }
            else {
                ultimoRegistro.ingreso = "S";
                setRegistraAcceso(ultimoRegistro, apiServicio1,entrada1,"S");

                entrada1.fondoInfo.setImageResource(R.drawable.check_blue);
                entrada1.container.setBackgroundColor(bkBlue);
            }
        }



    }

}
