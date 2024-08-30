namespace SV.Learning.Core.OOPS.Constructors
{
    public class StaticConstructor
    {
        // static int
        public static int StaticInt = 0;
        static StaticConstructor()
        {
            StaticInt++;
            Console.WriteLine("Static Constructor called, {0} time", StaticInt);
        }
    }
}
