package com.retrofitintro;

import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.GET;
import retrofit2.http.Headers;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Query;
import retrofit2.http.Url;

import com.google.gson.JsonObject;
import com.google.gson.JsonArray;

import org.json.JSONObject;

public interface APIInterface {

    String param1 = "./";
    String token = "";


    @FormUrlEncoded
    @POST(param1 + "/usuarios/authenticate/")
    Call<JsonObject> loginUsuario(@Field("username") String username, @Field("password") String password);

    @FormUrlEncoded
    @PUT(param1 + "/ubicacioneventoes")
    Call<JsonObject> registraAcceso(@Body JSONObject datos, @Query("token") String token);


    @Headers("Content-Type: application/json")
    @PUT(param1 + "/ubicacioneventoes/")
    Call<Void> registraAcceso2(@Query("token") String token, @Body Registro2 body);

    // @GET(param1 + "/eventoes/list")

    @GET("https://services.paseshow.com.ar/ms-evento/eventoes/list")
    Call<JsonArray> listarEventos();

    @GET(param1 + "/sectoreventoes/clean")
    Call<JsonArray> listarSectores(@Query("find") String find, @Query("eventoId") String eventoId);

    @GET(param1 + "/ubicacioneventoes")
    Call<JsonArray> consultaQR(@Query("find") String find, @Query("qr") String qr, @Query("token") String token, @Query("sectorEventoId") String sectorEventoId);

    @GET(param1 + "/ubicacioneventoes")
    Call<JsonArray> consultaDNI(@Query("find") String find, @Query("dni") String dni, @Query("fechaFuncion") String fechaFuncion, @Query("token") String token, @Query("sectorEventoId") String sectorEventoId);


    @GET(param1 + "/ubicacioneventoes/dump")
    Call<JsonArray> sectoresDump(@Query("sectorEventoId") String sectorEventoId, @Query("token") String token);

    @Headers("Content-Type: application/x-www-form-urlencoded")
    @FormUrlEncoded
    @POST(param1 + "repo/productor/entradas")
    Call<JsonArray> viewProductor(@Field("token") String token);

    @POST
    Call<JsonArray> viewProductor2(@Url String ur);

}
