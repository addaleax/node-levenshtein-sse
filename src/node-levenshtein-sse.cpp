#include "../levenshtein-sse/levenshtein-sse.hpp"
#include <nan.h>
#include <iostream>

// TypedArrayContents *may* be v8::String::Value
template<typename TypedArrayContents>
NAN_METHOD(LevenshteinSSESync) {
  const TypedArrayContents a(info[0]);
  const TypedArrayContents b(info[1]);
  
  if (*a == nullptr || *b == nullptr) {
    info.GetReturnValue().Set(-1);
  }
  
  std::uint32_t r = levenshteinSSE::levenshtein(*a, *a + a.length(), *b, *b + b.length());
  info.GetReturnValue().Set(r);
}

template<typename TypedArrayContents>
class LevenshteinSSEWorker : public Nan::AsyncWorker {
 public:
  LevenshteinSSEWorker(Nan::Callback* callback, v8::Local<v8::Value> a_, v8::Local<v8::Value> b_)
    : AsyncWorker(callback), a(a_), b(b_), result(-1) {
    SaveToPersistent(0U, a_);
    SaveToPersistent(1U, b_);
  }
  ~LevenshteinSSEWorker() {}

  void Execute () {
    if (*a == nullptr || *b == nullptr) {
      return;
    }
    
    result = levenshteinSSE::levenshtein(*a, *a + a.length(), *b, *b + b.length());
  }

  void HandleOKCallback () {
    Nan::HandleScope scope;

    v8::Local<v8::Value> argv[] = {
      Nan::Null(),
      Nan::New<v8::Number>(result)
    };

    callback->Call(2, argv);
  }

 private:
  const TypedArrayContents a, b;
  std::uint32_t result;
};

template<typename TypedArrayContents>
NAN_METHOD(LevenshteinSSEAsync) {
  Nan::Callback* callback = new Nan::Callback(info[2].As<v8::Function>());
  Nan::AsyncQueueWorker(new LevenshteinSSEWorker<TypedArrayContents>(callback, info[0], info[1]));
}

NAN_MODULE_INIT(Init) {
  Nan::Export(target, "levenshteinSyncStr",      LevenshteinSSESync <v8::String::Value>);
  Nan::Export(target, "levenshteinAsyncStr",     LevenshteinSSEAsync<v8::String::Value>);
  Nan::Export(target, "levenshteinSyncUint8",    LevenshteinSSESync <Nan::TypedArrayContents<std::uint8_t>>);
  Nan::Export(target, "levenshteinAsyncUint8",   LevenshteinSSEAsync<Nan::TypedArrayContents<std::uint8_t>>);
  Nan::Export(target, "levenshteinSyncUint16",   LevenshteinSSESync <Nan::TypedArrayContents<std::uint16_t>>);
  Nan::Export(target, "levenshteinAsyncUint16",  LevenshteinSSEAsync<Nan::TypedArrayContents<std::uint16_t>>);
  Nan::Export(target, "levenshteinSyncUint32",   LevenshteinSSESync <Nan::TypedArrayContents<std::uint32_t>>);
  Nan::Export(target, "levenshteinAsyncUint32",  LevenshteinSSEAsync<Nan::TypedArrayContents<std::uint32_t>>);
  Nan::Export(target, "levenshteinSyncFloat32",  LevenshteinSSESync <Nan::TypedArrayContents<float>>);
  Nan::Export(target, "levenshteinAsyncFloat32", LevenshteinSSEAsync<Nan::TypedArrayContents<float>>);
  Nan::Export(target, "levenshteinSyncFloat64",  LevenshteinSSESync <Nan::TypedArrayContents<double>>);
  Nan::Export(target, "levenshteinAsyncFloat64", LevenshteinSSEAsync<Nan::TypedArrayContents<double>>);
}

NODE_MODULE(levenshtein_sse, Init)
