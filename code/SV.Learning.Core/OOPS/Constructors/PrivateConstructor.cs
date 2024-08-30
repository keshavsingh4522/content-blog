namespace SV.Learning.Core.OOPS.Constructors;

public class PrivateConstructor
{
    public int Num1 { get; set; }
    public int Num2 { get; set; }
    public int Total { get; set; }
    public static string name, location;

    // Prevent an automatic generation of the default constructor
    private PrivateConstructor()
    {
        Console.WriteLine("I am private no parameter constructor");
    }

    private PrivateConstructor(string a)
    {
        Console.WriteLine("I am private parameterized constructor, {0}", a);
    }

    PrivateConstructor(string a, int b)
    {
        Console.WriteLine("I am private parameterized constructor, {0}:{1}", a, b);
    }

    public PrivateConstructor(int a, int b)
    {
        Num1 = a;
        Num2 = b;
        Total = a + b;
    }

    public PrivateConstructor(string a, string b)
    {
        name = a;
        location = b;
    }

}
